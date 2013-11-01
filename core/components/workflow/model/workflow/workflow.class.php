<?php
// error_reporting(-1);
/**
 * CMP class file for Workflow extra
 *
 * Copyright 2013 by Andreas Bilz Andreas Bilz <andreas@subsolutions.at>
 * Created on 09-30-2013
 *
 * Workflow is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * Workflow is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Workflow; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * @package workflow
 */

require_once MODX_CORE_PATH.'model/modx/modprocessor.class.php';
require_once MODX_CORE_PATH.'model/modx/processors/resource/update.class.php';
require_once MODX_CORE_PATH.'model/modx/processors/resource/updatefromgrid.class.php';

 class Workflow {
    /** @var $modx modX */
    public $modx;
    /** @var $props array */
    public $config;

    function __construct(modX &$modx,array $config = array()) {
        $this->modx =& $modx;
        $corePath = $modx->getOption('workflow.core_path',null,
            $modx->getOption('core_path').'components/workflow/');
        $assetsUrl = $modx->getOption('workflow.assets_url',null,
            $modx->getOption('assets_url').'components/workflow/');

        $this->config = array_merge(array(
            'corePath' => $corePath,
            'chunksPath' => $corePath.'elements/chunks/',
            'modelPath' => $corePath.'model/',
            'processorsPath' => $corePath.'processors/',
            'elementsPath' => $corePath.'elements/',

            'assetsUrl' => $assetsUrl,
            'connectorUrl' => $assetsUrl.'connector.php',
            'cssUrl' => $assetsUrl.'css/',
            'jsUrl' => $assetsUrl.'js/',
        ),$config);

        $this->modx->addPackage('workflow',$this->config['modelPath']);
        if ($this->modx->lexicon) {
            $this->modx->lexicon->load('workflow:default');
            $this->modx->lexicon->load('workflow:dashboard');
        }
    }

    /**
     * Initializes Workflow based on a specific context.
     *
     * @access public
     * @param string $ctx The context to initialize in.
     * @return string The processed content.
     */
    public function initialize($ctx = 'mgr') {
        $output = '';
        switch ($ctx) {
            case 'mgr':
                if (!$this->modx->loadClass('workflow.request.WorkflowControllerRequest',
                    $this->config['modelPath'],true,true)) {
                        return 'Could not load controller request handler.';
                }
                $this->request = new WorkflowControllerRequest($this);
                $output = $this->request->handleRequest();
                break;
        }
        return $output;
    }

    public function process()
    {
        $success = false;
        $res = $this->config['res'];
        $props = $this->config['props'];
        
        // Fire OnDocStatusChange
        $response = array(
            'id'        => $res->get('id'),
            'status'    => $props['status'],
            'resource'  => $res,
            );
        $this->modx->invokeEvent('OnDocStatusChange', $response);
        
        $this->saveResource();

        $this->config['action'] = $this->createAction();
        if($this->config['action'])
            $success = true;

        if($success)
            $this->writeMgrLog();
        
        // if($props['sendmail'])
        $admin_group = $this->modx->getObject('modUserGroup', $this->modx->getOption('workflow.admin_group'));
        if(!$this->modx->user->isMember($admin_group->get('name')))
            if($this->sendMail())
                $success = true;
        

        return $success;
    }

    public function saveResource()
    {
        $res = $this->config['res'];
        $props = $this->config['props'];
        $tvs = array();
        $tvs['status'] = $res->getTVValue('wfStatus');
        $tvs['author'] = $res->getTVValue('wfAuthor');

        if($tvs['status'] != $this->config['props']['status'])
            if($res->setTVValue('wfStatus', $this->config['props']['status']) 
                && $res->setTVValue('wfAuthor', $this->modx->user->get('id')))
                return true;
        // return false;
    }

    /**
     * Reject resource
     *
     * Editor needs to refactor the contents of a resource
     * @return [type] [description]
     */
    public function rejectResource()
    {
        # code...
    }

    public function createItem()
    {
        # code...
    }

    /**
     * Send mail to editor or chief
     * @return [type] [description]
     */
    public function sendMail()
    {
        $editorProfile = $this->modx->user->getOne('Profile');
        $resource = $this->config['res'];
        $author = $this->modx->getObject('modUser', array('username' => $this->config['props']['author']));
        $authorProfile = $author->getOne('Profile');

        $phs = array('wf' => 
            array(
                'editor' => array(
                    'user'      => $this->modx->user->toArray(),
                    'profile'   => $editorProfile->toArray(),
                    ),
                'author' => array(
                    'user'      => $author->toArray(),
                    'profile'   => $authorProfile->toArray(),
                    ),
                'action'    => $this->config['action'],
                'properties'=> array_merge(array(
                    'joined' => http_build_query($this->config['props'])
                    ), $this->config['props']),
                'resource'  => $resource->toArray(),
                'links' => array(
                    'frontend' => $this->modx->makeUrl($resource->get('id'), 'web', '', 'full'),
                    'backend' => $this->modx->getOption('site_url') . 'manager/?a=30&id=' . $resource->get('id'),
                    )
                ),
            );
        
        // Generate mail
        $message = $this->modx->getChunk('wfMail', $phs);
        
        // Fake the header & footer
        $tpl = file_get_contents($this->config['elementsPath'] . 'smarty/mail/template.tpl');
        $chunk = $this->modx->newObject('modChunk');
        $chunk->setCacheable(false);
        $output = $chunk->process(array('content' => $message), $tpl);

        $this->modx->getService('mail', 'mail.modPHPMailer');
        $this->modx->mail->set(modMail::MAIL_BODY,$output);
        $this->modx->mail->set(modMail::MAIL_FROM,'workflow@localhorst.com');
        $this->modx->mail->set(modMail::MAIL_FROM_NAME,'Horst Lokal');
        $this->modx->mail->set(modMail::MAIL_SUBJECT,'Brand New Workflow Mail');
        $this->modx->mail->address('to',$this->modx->getOption('workflow.admin_email'));
        $this->modx->mail->address('reply-to','workflow@localhorst.com');
        $this->modx->mail->setHTML(true);
        if (!$this->modx->mail->send()) {
            $this->modx->log(modX::LOG_LEVEL_ERROR,'An error occurred while trying to send the email: '.$this->modx->mail->mailer->ErrorInfo);
            return false;
        }
        $this->modx->mail->reset();
        return true;
    }

    /**
     * [triggerEvent description]
     * @param  [type] $event [description]
     * @param  [type] $data  [description]
     * @return [type]        [description]
     */
    public function triggerEvent($event, $data)
    {
        // Prepare the event and the additional data
        $response = array(
            'id'        => $res->get('id'),
            'status'    => $scriptProperties['status'],
            'resource'  => $res,
            );
        $this->modx->invokeEvent('OnDocStatusChange', $response);
    }

    public function writeMgrLog($item = array())
    {
        $res = $this->config['res'];

        $item = array_merge(array(
            'prefix'    => 'wf:',
            'user_id'   => $this->modx->user->get('id'),
            'res'       => $this->config['res'],
            'action'    => 'changed_status',
            'classKey'  => 'modResource',
            'item'      => $res->get('id'),
        ), $item);
        
        // Feed the manager log
        $l = $this->modx->newObject('modManagerLog');
        $data = array(
          'user'      => $item['user_id'],
          'occurred'  => date('Y-m-d H:i:s'),
          'action'    => $item['prefix'] . $item['action'],
          'classKey'  => $item['classKey'],
          'item'      => $item['item']
          );

        $l->fromArray($data);
        $l->save();
    }

    public function createAction()
    {
        $action = $this->modx->newObject('WfActions');
        $data = array(
            'key' => md5(implode($this->config['props'])),
            'properties' => serialize($this->config['props'])
            );
        $action->fromArray($data);
        if($action->save())
            return $action->toArray();
        return false;
    }

    public function generateActionLinks()
    {
        $action = $this->config['action'];
        
    }

    /**
     * Runs the given action by its ID
     * @param  string $key MD5 encrypted string
     * @return boolean         True or false
     */
    public function runAction($key)
    {
        $action = $this->modx->getObject('WfActions', array('key' => $key));
        $properties = unserialize($action->get('properties'));
        $this->modx->runProcessor($properties['action'], array($properties), array('processors_path' => $this->config['processorsPath']));
    }

    // MORE METHODS TO DEAL WITH WORKFLOWS
    // NEEDS SOME RESEARCH
}
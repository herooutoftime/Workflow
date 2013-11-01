<?php
/**
 * Workflow plugin for Workflow extra
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

/**
 * Description
 * -----------
 * [[+description]]
 *
 * Variables
 * ---------
 * @var $modx modX
 * @var $scriptProperties array
 *
 * @package workflow
 **/

$event = $modx->event->name;

// Check for Workflow enable status
// If not, leave
if(!$modx->getOption('workflow.enabled'))
    return;

switch($event) {
	case 'OnManagerPageInit':
		// Check for Workflow enable status
        // If not, leave
        if(!$modx->getOption('workflow.enabled'))
            return;
		
		$workflowCorePath = $modx->getOption('workflow.core_path',null,$modx->getOption('core_path').'components/workflow/');
		require_once $workflowCorePath.'model/workflow/workflow.class.php';
		$workflow = new Workflow($modx);

		$modx->regClientStartupScript($workflow->config['assetsUrl'] . 'js/workflow.js');
		$modx->regClientStartupHTMLBlock('<script type="text/javascript">
		Ext.onReady(function() {
			// if(MODx.isEmpty(Workflow)) {
			    Workflow.config = '.$modx->toJSON($workflow->config).';
			    Workflow.config.connector_url = "'.$workflow->config['connectorUrl'].'";
			    Workflow.config.assets_url = "'.$workflow->config['assetsUrl'].'";
			    Workflow.request = '.$modx->toJSON($_GET).';
			    Workflow.action = "'.(!empty($_REQUEST['a']) ? $_REQUEST['a'] : 0).'";
			    Workflow.site_id = "'. $modx->site_id .'";
			// }
		});
		</script>');
		$modx->regClientStartupScript($workflow->config['assetsUrl'] . 'js/workflow.plugin.js');
		
		// Add the plugin for button only for administrator
		$admin_group = $modx->getObject('modUserGroup', $modx->getOption('workflow.admin_group'));
		if($modx->user->isMember($admin_group->get('name')))
			$modx->regClientStartupScript($workflow->config['assetsUrl'] . 'js/workflow.button.plugin.js');	

	break;

	case 'OnDocStatusChange':
		// Check for Workflow enable status
		// If not, leave
		if(!$modx->getOption('workflow.enabled'))
		    return;

		$modx->log(MODX_LOG_LEVEL_ERROR, 'ONDOCSTATUSCHANGE ' . $id);
	break;

	// case 'OnDocFormPrerender':
	// 	$modx->regClientStartupScript($workflow->config['assetsUrl'] . 'js/workflow.button.plugin.js');	
	// break;

	case 'OnDocFormDelete':
		// Check for Workflow enable status
		// If not, leave
		if(!$modx->getOption('workflow.enabled'))
		    return;
		$resource->setTVValue('wfStatus', 'deleted');
		$resource->save();
	break;

	case 'OnDocFormSave':
		// Check for Workflow enable status
		// If not, leave
		if(!$modx->getOption('workflow.enabled'))
		    return;

		// Handle new resources
		// and set the TV values
		if ($mode == 'new') {
			$resource->setTVValue('wfAuthor', $modx->user->get('id'));
		}
		
		// Check if the wfAuthor is set
		// Else get the creator or last editor
		$wfAuthor = $resource->getTVValue('wfAuthor');
		if(empty($wfAuthor) || $wfAuthor == '') {
			if($resource->get('createdby'))
				$wfAuthor = $resource->get('createdby');
			// if($resource->get('editedby'))
			// 	$wfAuthor = $resource->get('editedby');
			$resource->setTVValue('wfAuthor', $wfAuthor);
			$resource->save();
		}

		// Any changes
		if(($_SESSION['workflow_status'] == $resource->getTVValue('wfStatus')) && ($_SESSION['workflow_author'] == $wfAuthor))
			return;

		$author = $modx->getObject('modUser', $wfAuthor);

		$workflowCorePath = $modx->getOption('workflow.core_path',null,$modx->getOption('core_path').'components/workflow/');
		require_once $workflowCorePath.'model/workflow/workflow.class.php';
		$modx->workflow = new Workflow($modx);
		$modx->lexicon->load('workflow:default');
		$modx->addPackage('workflow', $workflowCorePath .'model/');

		$action = 'mgr/status/change';
		$properties = array(
			'id'		=> $resource->get('id'),
			'author'	=> $author->get('username'),
			'status'	=> $resource->getTVValue('wfStatus'),
			);
		$response = $modx->runProcessor($action, $properties, array('processors_path' => $modx->workflow->config['processorsPath']));
		// $modx->log(MODX_LOG_LEVEL_ERROR, json_encode($response));
	break;

	case 'OnBeforeDocFormSave':
		// Check for Workflow enable status
		// If not, leave
		if(!$modx->getOption('workflow.enabled'))
		    return;
		
		$_SESSION['workflow_status'] = $resource->getTVValue('wfStatus');
		$_SESSION['workflow_author'] = $resource->getTVValue('wfAuthor');
	break;
}
return;
<?php
/**
 * @package modx
 * @subpackage dashboard
 */
/**
 * Renders a grid of recently edited resources by the active user
 * 
 * @package modx
 * @subpackage dashboard
 */
class modDashboardWidgetWorkflow extends modDashboardWidgetInterface {
    public function render() {
        // Check for Workflow enable status
        // If not, leave
        if(!$this->modx->getOption('workflow.enabled'))
            return;
        $this->modx->getService('lexicon','modLexicon');
    	$this->modx->lexicon->load('workflow:dashboard');
        $this->modx->lexicon->load('workflow:default');
        $this->modx->lexicon->loadCache('workflow','dashboard');
        $assetsUrl = $this->modx->getOption('workflow.assets_url',null,$this->modx->getOption('assets_url').'components/workflow/');
        $this->modx->controller->addCss($assetsUrl . 'css/mgr.css');
        
        $workflowCorePath = $this->modx->getOption('workflow.core_path',null,$this->modx->getOption('core_path').'components/workflow/');
        require_once $workflowCorePath.'model/workflow/workflow.class.php';
        $workflow = new Workflow($this->modx);

        $this->modx->controller->addHtml('<script type="text/javascript">Ext.onReady(function() {
            Workflow.config = '.$this->modx->toJSON($workflow->config).';
            Workflow.config.connector_url = "'.$workflow->config['connectorUrl'].'";
            Workflow.config.assets_url = "'.$workflow->config['assetsUrl'].'";
            Workflow.request = '.$this->modx->toJSON($_GET).';
            Workflow.action = "'.(!empty($_REQUEST['a']) ? $_REQUEST['a'] : 0).'";
            Workflow.site_id = "'. $this->modx->site_id .'";
        });
        </script>');
        
        $this->modx->controller->addJavascript($assetsUrl . 'js/workflow.js');
    	$this->modx->controller->addJavascript($assetsUrl . 'js/widgets/dashboard.grid.js');
        $this->modx->controller->addHtml('<script type="text/javascript">Ext.onReady(function() {
		    MODx.load({
		        xtype: "workflow-grid-resource"
		        ,user: "'.$this->modx->user->get('id').'"
		        ,renderTo: "workflow-grid-resource"
		    });
		});</script>');
        // return $this->getFileChunk('dashboard/recentlyeditedresources.tpl');
        return '<div id="workflow-grid-resource"></div>';
    }
}
return 'modDashboardWidgetWorkflow';
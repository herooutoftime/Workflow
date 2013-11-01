<?php
require_once dirname(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__))))))) . '/config.core.php';
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

$workflowCorePath = $modx->getOption('workflow.core_path',null,$modx->getOption('core_path').'components/workflow/');
require_once $workflowCorePath.'model/workflow/workflow.class.php';
$modx->workflow = new Workflow($modx);
$modx->lexicon->load('workflow:default');
$modx->addPackage('workflow', $workflowCorePath .'model/');
// $modx->log(MODX_LOG_LEVEL_ERROR, 'tracking image requested');
if($modx->workflow)
	echo 'yep, workflow!';
$modx->workflow->runAction($_GET['action']);
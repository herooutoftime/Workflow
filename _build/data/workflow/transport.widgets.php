<?php
// $widgets[1]= $modx->newObject('modDashboardWidget');
$widgets = array(
	'workflow.dashboard' => array(
  		'name' => 'workflow.dashboard.title',
		'description' => 'workflow.dashboard.description',
		'type' => 'file',
		'size' => 'full',
		'content' => '[[++core_path]]components/workflow/elements/dashboards/workflow.dashboard.php',
		'namespace' => 'workflow',
		'lexicon' => 'workflow:default',
		)
	);

return $widgets;
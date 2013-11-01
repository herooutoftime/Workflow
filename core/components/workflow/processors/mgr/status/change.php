<?php
if(!isset($scriptProperties['id']))
	return;

if(!isset($scriptProperties['author']))
	$scriptProperties['author'] = $modx->user->get('username');

$res = $this->modx->getObject('modResource', $scriptProperties['id']);
// Error - not a resource
if(!$res)
	return $this->modx->error->failure('Resource not found');

// Check the current status and process on change

// Run the Workflow methods
// But do it in the Workflow class

$this->modx->workflow->config['res'] = $res;
$this->modx->workflow->config['props'] = $scriptProperties;

// $data = array(
// 	'res' => $res,
// 	'props' => $scriptProperties,
// 	);

if($this->modx->workflow->process())
	return $this->modx->error->success();

return $this->modx->error->failure('');
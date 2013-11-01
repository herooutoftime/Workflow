<?php
if(!isset($scriptProperties['id']))
	return;

$res = $modx->getObject('modResource', $scriptProperties['id']);
if(!$res)
	return $modx->error->failure('Not a resource');

$author = $res->getTVValue('wfAuthor');
if(!$author)
	$author = $res->get('createdby');

$author = $modx->getObject('modUser', array('id' => $author));
$authorProfile = $author->getOne('Profile');

return $modx->error->success('', array('author' => $authorProfile->toArray(), 'resource' => $res->toArray()));
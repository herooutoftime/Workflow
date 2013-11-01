<?php
/**
* Connector file for Workflow extra
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
/* @var $modx modX */

// Check for development environment
if(strpos(__FILE__, 'mycomponents') === FALSE) {
	require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
} else {
	require_once dirname(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__))))))) . '/config.core.php';
}

require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

$workflowCorePath = $modx->getOption('workflow.core_path', null, $modx->getOption('core_path') . 'components/workflow/');
require_once $workflowCorePath . 'model/workflow/workflow.class.php';
$modx->workflow = new Workflow($modx);

$modx->lexicon->load('workflow:default');

/* handle request */
$path = $modx->getOption('processorsPath', $modx->workflow->config, $workflowCorePath . 'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));
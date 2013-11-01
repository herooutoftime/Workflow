<?php
/**
 * Resolver for Workflow extra
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
 * @package workflow
 * @subpackage build
 */

/* @var $object xPDOObject */
/* @var $modx modX */

/* @var array $options */

if ($object->xpdo) {
    $modx =& $object->xpdo;
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            
            $modelPath = $modx->getOption('workflow.core_path',null,$modx->getOption('core_path').'components/workflow/').'model/';
            $modx->addPackage('workflow',$modelPath);

            $manager = $modx->getManager();
            $manager->createObjectContainer('WfActions');

        	// $modx->log(xPDO::LOG_LEVEL_ERROR, dirname(dirname(__FILE__)) . 'data/workflow/transport.widgets.php');
            // $widgets = include dirname(dirname(__FILE__)) . 'data/workflow/transport.widgets.php';
            
            // // Create the dashboard widgets
            // foreach($widgets as $widget) {
            // 	$wid = $modx->getObject('modDashboardWidget', array('content' => $widget['content'], 'namespace' => $widget['namespace']));
            // 	if(!$wid)
            // 		$wid = $modx->newObject('modDashboardWidget');
            // 	if($wid) {
            // 		$wid->fromArray($widget);
            // 		if($wid->save())
            // 			$wid_arr[$wid->get('id')] = $wid->toArray('', false, true);
            // 	}
            // }

            // // Register the widgets in default dashboard
            // foreach($wid_arr as $key => $widget) {
            // 	$wid = $modx->getObject('modDashboardWidgetPlacement', array('dashboard' => 1, 'widget' => $key));
            // 	if(!$wid)
            // 		$wid = $modx->newObject('modDashboardWidgetPlacement');
            // 	$wid->fromArray($widget);
            // 	$wid->save();
            // }
            break;

        case xPDOTransport::ACTION_UNINSTALL:
            break;
    }
}

return true;
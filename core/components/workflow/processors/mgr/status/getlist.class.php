<?php
/**
 * Processor file for Workflow extra
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
 * @subpackage processors
 */

/* @var $modx modX */

class WorkflowStatusGetlistProcessor extends modObjectGetListProcessor {
    public $classKey = 'WfStates';
    public $languageTopics = array('workflow:default');
    public $defaultSortField = 'id';
    public $defaultSortDirection = 'ASC';
}
return 'WorkflowStatusGetlistProcessor';
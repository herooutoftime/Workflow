<?php
class WorkflowStatusUpdateProcessor extends modObjectUpdateProcessor {
    public $classKey = 'WfStates';
    public $languageTopics = array('workflow:default');
    public $objectType = 'workflow.status';
}
return 'WorkflowStatusUpdateProcessor';
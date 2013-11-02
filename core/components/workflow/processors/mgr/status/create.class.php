<?php
class WorkflowStatusCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'WfStates';
    public $languageTopics = array('workflow:default');
    public $objectType = 'workflow.status';
}
return 'WorkflowStatusCreateProcessor';
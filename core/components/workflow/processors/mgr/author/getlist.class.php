<?php
class WorkflowAuthorGetlistProcessor extends modObjectGetListProcessor {
    public $classKey = 'modUser';
    public $languageTopics = array('workflow:default');
    public $defaultSortField = 'id';
    public $defaultSortDirection = 'ASC';
}
return 'WorkflowAuthorGetlistProcessor';
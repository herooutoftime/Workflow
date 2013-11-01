<?php
/**
 * Processor: Change resource publish status via context menu
 */

class ChangePublishProcessor extends modResourceUpdateProcessor {
	public $classKey = 'modResource';
    public $languageTopics = array('workflow:default');
    
    public function beforeSet() {
    	// var_dump($this->getProperties());
    	$this->setProperty('published', !$this->object->get('published'));
    	return parent::beforeSet();
    }
}
return 'ChangePublishProcessor';
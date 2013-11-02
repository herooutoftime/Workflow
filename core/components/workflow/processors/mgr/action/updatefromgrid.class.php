<?php
// require_once (dirname(__FILE__).'/update.class.php');
class ChangeUpdateFromGridProcessor extends modResourceUpdateFromGridProcessor {
	public $classKey = 'modResource';
    public $languageTopics = array('workflow:default');
    
    public function beforeSet() {
    	$author = $this->object->getTVValue('wfAuthor');
    	$status = $this->object->getTVValue('wfStatus');
    	$publish = $this->object->get('published');
        $delete = $this->object->get('deleted');

        if($this->getProperty('published'))
            $this->setProperty('status', 'public');
        
        if(!$this->getProperty('published'))
            $this->setProperty('status', 'awaiting');

        // if($this->getProperty('deleted'))
        //     $this->setProperty('status', 'deleted');
        
        // if(!$this->getProperty('deleted'))
        //     $this->setProperty('status', ($this->getProperty('published') ? 'public' : 'awaiting'));

        $tvAuthor = $this->modx->getObject('modTemplateVar', array('name' => 'wfAuthor'));
        $tvStatus = $this->modx->getObject('modTemplateVar', array('name' => 'wfStatus'));

    	// if($author == $this->getProperty('author') && $status == $this->getProperty('status') && $publish == $this->getProperty('published'))
    	// 	return false;

    	$this->setProperty('tvs', true);
        $this->setProperty('tv' . $tvAuthor->get('id'), $this->getProperty('author'));
        $this->setProperty('tv' . $tvStatus->get('id'), $this->getProperty('status'));
        return parent::beforeSet();
    }
}
return 'ChangeUpdateFromGridProcessor';
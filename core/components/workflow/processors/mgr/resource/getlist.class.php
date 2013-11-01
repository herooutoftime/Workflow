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


class WorkflowResourceGetlistProcessor extends modObjectGetListProcessor {
    public $classKey = 'modResource';
    public $languageTopics = array('workflow:default');
    // public $defaultSortField = 'createdon';
    // public $defaultSortDirection = 'DESC';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $c->innerJoin('modTemplateVarResource','TemplateVarResources');
        // $c->innerJoin('modTemplateVarResource','TemplateVarResources2');
        $c->innerJoin('modTemplateVar','TemplateVar','TemplateVarResources.tmplvarid = TemplateVar.id');
        // $c->innerJoin('modTemplateVar','TemplateVar2','TemplateVarResources.tmplvarid = TemplateVar2.id');
        if($this->getProperty('state')) {
            $c->where(array(
                'TemplateVar.name' => 'wfStatus',
                'TemplateVarResources.value' => $this->getProperty('state'),
            ));
        } else {
            $c->where(array(
                'TemplateVar.name' => 'wfStatus',
                'TemplateVarResources.value:!=' => null,
            ));
        }
        
        if($this->getProperty('author'))
            $c->where(array(
                'TemplateVar.name' => 'wfAuthor',
                'TemplateVarResources.value' => $this->getProperty('author')
            ));
        $c->where(array(
            'deleted' => 0
            ));
        // if($this->modx->getOptin())
        // $orderDate = '(CASE WHEN editedon = 0 THEN createdon ELSE editedon END)';
        // $c->sortby($orderDate, 'DESC');
        $orderStatus = '(CASE WHEN status = \'awaiting\' THEN 1 ELSE 2 END)';
        $c->sortby($orderStatus, 'ASC');
        
        $c->select($this->modx->getSelectColumns('modResource','modResource', '', array('id', 'pagetitle', 'published', 'publishedon')));
        $c->select(array(
            'status' => $this->modx->getSelectColumns('modTemplateVarResource','TemplateVarResources', '', array('value')),
            ));
        
        // 'modTemplateVarResource' => $xpdo->getSelectColumns('modTemplateVarResource','modTemplateVarResource','',array('value')),);
        $c->prepare();
        // echo $c->toSQL() . "\n";
        return $c;
    }


    /**
     * Convert category ID to category name for objects with a category.
     * Convert template ID to template name for objects with a template
     *
     * Note: It's much more efficient to do these with a join, but that can
     * only be done for objects known to have the field. This code can
     * be used on any object.
     *
     * @param xPDOObject $object
     * @return array
     */
    public function prepareRow(xPDOObject $object) {
        $fields = $object->toArray();
        unset($fields['author']);
        unset($fields['preview_url']);
        $fields['preview_url'] = $this->modx->makeUrl($fields['id'], 'web', '', 'full');
        $author = $this->modx->getObject('modUser', $object->getTVValue('wfAuthor'));
        $fields['author'] = $author->get('username');
        
        // ["Neu", "new"],
        // ["Wartet auf Veröffentlichung", "awaiting"],
        // ["Abgewiesen", "rejected"],
        // ["In Überarbeitung", "progress"],
        // ["Öffentlich", "public"],
        // ["Löschung beantragt", "deleted"]
        switch($fields['status']) {
            case 'new':
                $fields['status_nice'] = 'Neu';
            break;
            case 'awaiting':
                $fields['status_nice'] = 'Wartet auf Veröffentlichung';
            break;
            case 'rejected':
                $fields['status_nice'] = 'Abgewiesen';
            break;
            case 'progress':
                $fields['status_nice'] = 'In Überarbeitung';
            break;
            case 'public':
                $fields['status_nice'] = 'Öffentlich';
            break;
            case 'deleted':
                $fields['status_nice'] = 'Löschung beantragt';
            break;
        }
        return $fields;
    }
}
return 'WorkflowResourceGetlistProcessor';

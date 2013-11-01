/**
 * JS file for Workflow extra
 *
 * Copyright 2013 by Bob Ray <http://bobsguides.com>
 * Created on 04-13-2013
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
 */
/* These are for LexiconHelper:
 $modx->lexicon->load('workflow:default');
 include 'workflow.class.php'
 */

Workflow.grid.Resources = function (config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config, {
        url: Workflow.config.connector_url
        , baseParams: {
           action: 'mgr/resource/getlist'
           // ,thread: config.thread
        }
        ,autoExpandColumn: 'pagetitle'
        ,save_action: 'mgr/resource/updateFromGrid'
        ,autosave: true
        ,pageSize: 100
        ,fields: [{
            name:'id', sortType: Ext.data.SortTypes.asInt
        },{
            name: 'pagetitle', sortType: Ext.data.SortTypes.asUCString
        },{
            name: 'published', sortType: Ext.data.SortTypes.asUCString
        },{
            name: 'publishedon'
        },{
            name: 'status'
        },{
            name: 'author'
        }]
        ,paging: true
        ,remoteSort: false
        ,cls: 'workflow-grid'
        ,sm: this.sm
        ,columns: [this.sm, {
            header: _('id')
            ,dataIndex: 'id'
            ,sortable: true
            ,width: 50
        },{
            header: _('pagetitle')
            ,dataIndex: 'pagetitle'
            ,sortable: true
            ,width: 100
        },{
            header: _('published')
            ,dataIndex: 'published'
            ,sortable: true
            ,width: 120
        },{
            header: _('publishedon')
            ,dataIndex: 'publishedon'
            ,sortable: false
            ,width: 300
        },{
            header: _('status')
            ,dataIndex: 'status'
            ,sortable: false
            ,width: 300
            ,editor: { xtype: 'workflow-combo-states' }
        },{
            header: _('author')
            ,dataIndex: 'author'
            ,sortable: false
            ,width: 300
            ,editor: { xtype: 'workflow-combo-authors' }
        }]
        ,viewConfig: {
            forceFit: true,
            enableRowBody: true,
            showPreview: true,
            getRowClass: function (rec, ri, p) {
                var cls = 'workflow-row';

                if (this.showPreview) {
                    return cls + ' workflow-resource-expanded';
                }
                return cls + ' workflow-resource-collapsed';
            }
        }
        ,tbar: [{
            text: _('workflow.bulkactions')
            , menu: this.getBatchMenu()
        }]
        ,listeners: {
            'afterAutoSave': {fn:function(response) {
                console.log(response);
                var w = MODx.load({
                    xtype: 'workflow-window-editor'
                    ,record: response.object
                    ,listeners: {
                        'success': {fn:this.refresh,scope:this}
                    }
                });
                w.setValues(response.object);
                w.show();
            }, scope: this }
        }
    });
    Workflow.grid.Resources.superclass.constructor.call(this, config)
};
Ext.extend(Workflow.grid.Resources, MODx.grid.Grid, {
    reloadResources: function () {
        this.getStore().baseParams = {
            action: 'mgr/resource/getList'
            ,orphanSearch: 'modResource'
        };

        this.getBottomToolbar().changePage(1);
        this.refresh();

    }
    ,_showMenu: function (g, ri, e) {
        e.stopEvent();
        e.preventDefault();
        this.menu.record = this.getStore().getAt(ri).data;
        if (!this.getSelectionModel().isSelected(ri)) {
            this.getSelectionModel().selectRow(ri);
        }
        this.menu.removeAll();

        var m = [];
        if (this.menu.record.menu) {
            m = this.menu.record.menu;
            if (m.length > 0) {
                this.addContextMenuItem(m);
                this.menu.show(e.target);
            }
        } else {
            var z = this.getBatchMenu();

            for (var zz = 0; zz < z.length; zz++) {
                this.menu.add(z[zz]);
            }
            this.menu.show(e.target);
        }
    }
    , getSelectedAsList: function () {
        var sels = this.getSelectionModel().getSelections();
        if (sels.length <= 0) return false;

        var cs = '';
        for (var i = 0; i < sels.length; i++) {
            cs += ',' + sels[i].data.id;
        }
        cs = Ext.util.Format.substr(cs, 1);
        return cs;
    }

    , changeCategory: function (btn, e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        var r = {ids: cs};
        if (!this.changeCategoryWindow) {
            this.changeCategoryWindow = MODx.load({
                  xtype: 'workflow-chunk-window-change-category'
                  , record: r
                  , listeners: {
                    'success': {fn: function (r) {
                        // this.refresh();
                        var sels = this.getSelectionModel().getSelections();
                        var cat = Ext.getCmp('workflow-chunk-category-combo').lastSelectionText;
                        var s = this.getStore();
                        for (var i = 0; i < sels.length; i = i + 1) {
                            var id = sels[i].get('id');
                            var ri = id;
                            var record = s.getById(ri);
                            record.set("category", cat);
                            record.commit();
                        }
                        this.getSelectionModel().clearSelections(false);
                    }, scope: this}
                }
                                                  });
        }
        this.changeCategoryWindow.setValues(r);
        this.changeCategoryWindow.show(e.target);
        return true;
    }
    ,getBatchMenu: function () {
        var bm = [];
        bm.push(
            {
                text: _('workflow.edit')
                ,handler: this.updateWorkflow
                ,scope: this
            });
        return bm;
    }
    ,updateWorkflow: function(btn, e) {
        console.log(this.menu.record);
        if (!this.updateWorkflowWindow) {
            this.updateWorkflowWindow = MODx.load({
                xtype: 'workflow-window-editor'
                ,record: this.menu.record
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }
        this.updateWorkflowWindow.setValues(this.menu.record);
        this.updateWorkflowWindow.show(e.target);
    }
});
Ext.reg('workflow-grid-resource', Workflow.grid.Resources);

Workflow.window.Editor = function(config) {
    config = config || {};
    console.log(config);
    Ext.applyIf(config,{
        title: _('workflow.leave_message.title')
        ,url: Workflow.config.connector_url
        ,baseParams: {
            action: 'mgr/status/change'
            ,id: config.record.id
        }
        ,fields: [{
            xtype: 'panel'
            ,html: '<strong>#' + config.record.id + '</strong>'
        },{
            xtype: 'workflow-combo-states'
            ,name: 'state'
            ,value: config.record.status
        },{
            xtype: 'workflow-combo-authors'
            ,name: 'author'
            ,value: config.record.author
        },{
            xtype: 'textarea'
            ,fieldLabel: _('workflow.window.message')
            ,name: 'message'
            ,anchor: '100%'
        },{
            xtype: 'xcheckbox'
            ,name: 'sendmail'
            ,hideLabel: true
            ,boxLabel: _('workflow.window.sendmail')
        }]
    });
    Workflow.window.Editor.superclass.constructor.call(this,config);
}
Ext.extend(Workflow.window.Editor,MODx.Window);
Ext.reg('workflow-window-editor', Workflow.window.Editor);

Workflow.combo.States = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        store: ['approved','hidden','pending','auto_approved']// this is the local values
        ,baseParams: { action: '' ,combo: true }
        ,mode: 'local'
        ,editable: false
    });
    Workflow.combo.States.superclass.constructor.call(this,config);
}
Ext.extend(Workflow.combo.States,MODx.combo.ComboBox);
Ext.reg('workflow-combo-states', Workflow.combo.States);

Workflow.combo.Authors = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        displayField: 'username'
        ,valueField: 'id'
        ,fields: ['id', 'username']
        ,url: Workflow.config.connectorUrl
        ,baseParams: {
            action: 'mgr/author/getlist'
            ,combo: true
        }
        // ,editable: false
    });
    Workflow.combo.Authors.superclass.constructor.call(this,config);
}
Ext.extend(Workflow.combo.Authors,MODx.combo.ComboBox);
Ext.reg('workflow-combo-authors', Workflow.combo.Authors);
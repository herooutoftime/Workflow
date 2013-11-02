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

Workflow.grid.Actions = function (config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config, {
        url: Workflow.config.connector_url
        , baseParams: {
           action: 'mgr/action/getlist'
           // ,thread: config.thread
        }
        ,save_action: 'mgr/action/updateFromGrid'
        ,autosave: true
        ,pageSize: 100
        ,fields: ['id','key','properties']
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
            header: _('workflow.header.key')
            ,dataIndex: 'key'
            ,sortable: true
            ,width: 100
        },{
            header: _('workflow.header.properties')
            ,dataIndex: 'properties'
            ,sortable: true
            ,width: 120
        }]
        ,viewConfig: {
            forceFit: true,
            enableRowBody: true,
            showPreview: true,
            getRowClass: function (rec, ri, p) {
                var cls = 'workflow-row';

                if (this.showPreview) {
                    return cls + ' workflow-actions-expanded';
                }
                return cls + ' workflow-actions-collapsed';
            }
        }
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
    Workflow.grid.Actions.superclass.constructor.call(this, config)
};
Ext.extend(Workflow.grid.Actions, MODx.grid.Grid, {
    reloadActions: function () {
        this.getStore().baseParams = {
            action: 'mgr/action/getList'
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
Ext.reg('workflow-grid-actions', Workflow.grid.Actions);




Workflow.window.Editor = function(config) {
    config = config || {};
    console.log(config);
    Ext.applyIf(config,{
        title: _('workflow.leave_message.title')
        ,url: Workflow.config.connector_url
        ,baseParams: {
            action: 'mgr/actions/change'
            ,id: config.record.id
        }
        ,fields: [{
            xtype: 'panel'
            ,html: '<strong>#' + config.record.id + '</strong>'
        },{
            xtype: 'workflow-combo-states'
            ,name: 'state'
            ,value: config.record.actions
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

// Workflow.combo.Actions = function(config) {
//     config = config || {};
//     Ext.applyIf(config,{
//         store: ['approved','hidden','pending','auto_approved']// this is the local values
//         ,baseParams: { action: '' ,combo: true }
//         ,mode: 'local'
//         ,editable: false
//     });
//     Workflow.combo.States.superclass.constructor.call(this,config);
// }
// Ext.extend(Workflow.combo.States,MODx.combo.ComboBox);
// Ext.reg('workflow-combo-states', Workflow.combo.States);
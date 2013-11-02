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

Workflow.grid.States = function (config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config, {
        url: Workflow.config.connector_url
        , baseParams: {
           action: 'mgr/status/getlist'
           // ,thread: config.thread
        }
        ,autoExpandColumn: 'pagetitle'
        ,save_action: 'mgr/status/updatefromgrid'
        ,autosave: true
        ,pageSize: 100
        ,fields: ['id','value','display']
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
            header: _('workflow.header.value')
            ,dataIndex: 'value'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: _('workflow.header.display')
            ,dataIndex: 'display'
            ,sortable: true
            ,width: 120
            ,editor: { xtype: 'textfield' }
        }]
        ,viewConfig: {
            forceFit: true,
            enableRowBody: true,
            showPreview: true,
            getRowClass: function (rec, ri, p) {
                var cls = 'workflow-row';

                if (this.showPreview) {
                    return cls + ' workflow-status-expanded';
                }
                return cls + ' workflow-status-collapsed';
            }
        }
        ,tbar: [{
            text: _('workflow.status.create')
            ,handler: { xtype: 'workflow-window-status-create' ,blankValues: true }
        }]
        // ,listeners: {
        //     'afterAutoSave': {fn:function(response) {
        //         console.log(response);
        //         var w = MODx.load({
        //             xtype: 'workflow-window-editor'
        //             ,record: response.object
        //             ,listeners: {
        //                 'success': {fn:this.refresh,scope:this}
        //             }
        //         });
        //         w.setValues(response.object);
        //         w.show();
        //     }, scope: this }
        // }
    });
    Workflow.grid.States.superclass.constructor.call(this, config)
};
Ext.extend(Workflow.grid.States, MODx.grid.Grid, {
    reloadStates: function () {
        this.getStore().baseParams = {
            action: 'mgr/status/getList'
            ,orphanSearch: 'modResource'
        };

        this.getBottomToolbar().changePage(1);
        this.refresh();

    }
    ,getSelectedAsList: function () {
        var sels = this.getSelectionModel().getSelections();
        if (sels.length <= 0) return false;

        var cs = '';
        for (var i = 0; i < sels.length; i++) {
            cs += ',' + sels[i].data.id;
        }
        cs = Ext.util.Format.substr(cs, 1);
        return cs;
    }
    ,getMenu: function() {
        return [{
            text: _('workflow.edit')
            ,handler: this.updateStatus
        }];
    }
    ,updateStatus: function(btn, e) {
        if (!this.updateStatusWindow) {
            this.updateStatusWindow = MODx.load({
                xtype: 'workflow-window-status-create'
                ,record: this.menu.record
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }
        this.updateStatusWindow.setValues(this.menu.record);
        this.updateStatusWindow.show(e.target);
    }
});
Ext.reg('workflow-grid-status', Workflow.grid.States);

Workflow.window.CreateStatus = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('workflow.status.create')
        ,url: Workflow.config.connectorUrl
        ,baseParams: {
            action: 'mgr/status/create'
        }
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('workflow.value')
            ,name: 'value'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('workflow.display')
            ,name: 'display'
            ,anchor: '100%'
        }]
    });
    Workflow.window.CreateStatus.superclass.constructor.call(this,config);
};
Ext.extend(Workflow.window.CreateStatus,MODx.Window);
Ext.reg('workflow-window-status-create',Workflow.window.CreateStatus);
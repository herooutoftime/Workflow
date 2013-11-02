
/* home.js*/
Ext.onReady(function(){MODx.load({xtype:'workflow-page-home'})});Workflow.page.Home=function(config){config=config||{};Ext.applyIf(config,{components:[{xtype:'workflow-panel-home',renderTo:'workflow-panel-home-div'}]});Workflow.page.Home.superclass.constructor.call(this,config)};Ext.extend(Workflow.page.Home,MODx.Component);Ext.reg('workflow-page-home',Workflow.page.Home)
/* action.grid.js*/
Workflow.grid.Actions=function(config){config=config||{};this.sm=new Ext.grid.CheckboxSelectionModel();Ext.applyIf(config,{url:Workflow.config.connector_url,baseParams:{action:'mgr/action/getlist'},save_action:'mgr/action/updateFromGrid',autosave:true,pageSize:100,fields:['id','key','properties'],paging:true,remoteSort:false,cls:'workflow-grid',sm:this.sm,columns:[this.sm,{header:_('id'),dataIndex:'id',sortable:true,width:50},{header:_('workflow.header.key'),dataIndex:'key',sortable:true,width:100},{header:_('workflow.header.properties'),dataIndex:'properties',sortable:true,width:120}],viewConfig:{forceFit:true,enableRowBody:true,showPreview:true,getRowClass:function(rec,ri,p){var cls='workflow-row';if(this.showPreview)return cls+' workflow-actions-expanded';return cls+' workflow-actions-collapsed'}},tbar:[{text:_('workflow.bulkactions'),menu:this.getBatchMenu()}],listeners:{afterAutoSave:{fn:function(response){console.log(response);var w=MODx.load({xtype:'workflow-window-editor',record:response.object,listeners:{success:{fn:this.refresh,scope:this}}});w.setValues(response.object);w.show()},scope:this}}});Workflow.grid.Actions.superclass.constructor.call(this,config)};Ext.extend(Workflow.grid.Actions,MODx.grid.Grid,{reloadActions:function(){this.getStore().baseParams={action:'mgr/action/getList'};this.getBottomToolbar().changePage(1);this.refresh()},_showMenu:function(g,ri,e){e.stopEvent();e.preventDefault();this.menu.record=this.getStore().getAt(ri).data;if(!this.getSelectionModel().isSelected(ri))this.getSelectionModel().selectRow(ri);this.menu.removeAll();var m=[];if(this.menu.record.menu){m=this.menu.record.menu;if(m.length>0){this.addContextMenuItem(m);this.menu.show(e.target)}}else{var z=this.getBatchMenu();for(var zz=0;zz<z.length;zz++)this.menu.add(z[zz]);this.menu.show(e.target)}},getSelectedAsList:function(){var sels=this.getSelectionModel().getSelections();if(sels.length<=0)return false;var cs='';for(var i=0;i<sels.length;i++)cs+=','+sels[i].data.id;cs=Ext.util.Format.substr(cs,1);return cs},changeCategory:function(btn,e){var cs=this.getSelectedAsList();if(cs===false)return false;var r={ids:cs};if(!this.changeCategoryWindow)this.changeCategoryWindow=MODx.load({xtype:'workflow-chunk-window-change-category',record:r,listeners:{success:{fn:function(r){var sels=this.getSelectionModel().getSelections(),cat=Ext.getCmp('workflow-chunk-category-combo').lastSelectionText,s=this.getStore();for(var i=0;i<sels.length;i=i+1){var id=sels[i].get('id'),ri=id,record=s.getById(ri);record.set("category",cat);record.commit()};this.getSelectionModel().clearSelections(false)},scope:this}}});this.changeCategoryWindow.setValues(r);this.changeCategoryWindow.show(e.target);return true},getBatchMenu:function(){var bm=[];bm.push({text:_('workflow.edit'),handler:this.updateWorkflow,scope:this});return bm},updateWorkflow:function(btn,e){console.log(this.menu.record);if(!this.updateWorkflowWindow)this.updateWorkflowWindow=MODx.load({xtype:'workflow-window-editor',record:this.menu.record,listeners:{success:{fn:this.refresh,scope:this}}});this.updateWorkflowWindow.setValues(this.menu.record);this.updateWorkflowWindow.show(e.target)}});Ext.reg('workflow-grid-actions',Workflow.grid.Actions);Workflow.window.Editor=function(config){config=config||{};console.log(config);Ext.applyIf(config,{title:_('workflow.leave_message.title'),url:Workflow.config.connector_url,baseParams:{action:'mgr/actions/change',id:config.record.id},fields:[{xtype:'panel',html:'<strong>#'+config.record.id+'</strong>'},{xtype:'workflow-combo-states',name:'state',value:config.record.actions},{xtype:'workflow-combo-authors',name:'author',value:config.record.author},{xtype:'textarea',fieldLabel:_('workflow.window.message'),name:'message',anchor:'100%'},{xtype:'xcheckbox',name:'sendmail',hideLabel:true,boxLabel:_('workflow.window.sendmail')}]});Workflow.window.Editor.superclass.constructor.call(this,config)};Ext.extend(Workflow.window.Editor,MODx.Window);Ext.reg('workflow-window-editor',Workflow.window.Editor)
/* chunk.grid.js*/
Workflow.grid.Chunks=function(config){config=config||{};this.sm=new Ext.grid.CheckboxSelectionModel();Ext.applyIf(config,{url:Workflow.config.connector_url,baseParams:{action:'mgr/chunk/getlist',thread:config.thread},pageSize:300,fields:[{name:'id',sortType:Ext.data.SortTypes.asInt},{name:'name',sortType:Ext.data.SortTypes.asUCString},{name:'category',sortType:Ext.data.SortTypes.asUCString},{name:'description'}],paging:true,autosave:false,remoteSort:false,autoExpandColumn:'description',cls:'workflow-grid',sm:this.sm,columns:[this.sm,{header:_('id'),dataIndex:'id',sortable:true,width:50},{header:_('name'),dataIndex:'name',sortable:true,width:100},{header:_('category'),dataIndex:'category',sortable:true,width:120},{header:_('description'),dataIndex:'description',sortable:false,width:300}],viewConfig:{forceFit:true,enableRowBody:true,showPreview:true,getRowClass:function(rec,ri,p){var cls='workflow-row';if(this.showPreview)return cls+' workflow-resource-expanded';return cls+' workflow-resource-collapsed'}},tbar:[{text:'Bulk Actions',menu:this.getBatchMenu()},{xtype:'tbspacer',width:200},{xtype:'button',id:'workflow-chunks-reload',text:'reload',listeners:{click:{fn:this.reloadChunks,scope:this}}}]});Workflow.grid.Chunks.superclass.constructor.call(this,config)};Ext.extend(Workflow.grid.Chunks,MODx.grid.Grid,{reloadChunks:function(){this.getStore().baseParams={action:'mgr/chunk/getList',orphanSearch:'modChunk'};this.getBottomToolbar().changePage(1);this.refresh()},_showMenu:function(g,ri,e){e.stopEvent();e.preventDefault();this.menu.record=this.getStore().getAt(ri).data;if(!this.getSelectionModel().isSelected(ri))this.getSelectionModel().selectRow(ri);this.menu.removeAll();var m=[];if(this.menu.record.menu){m=this.menu.record.menu;if(m.length>0){this.addContextMenuItem(m);this.menu.show(e.target)}}else{var z=this.getBatchMenu();for(var zz=0;zz<z.length;zz++)this.menu.add(z[zz]);this.menu.show(e.target)}},getSelectedAsList:function(){var sels=this.getSelectionModel().getSelections();if(sels.length<=0)return false;var cs='';for(var i=0;i<sels.length;i++)cs+=','+sels[i].data.id;cs=Ext.util.Format.substr(cs,1);return cs},changeCategory:function(btn,e){var cs=this.getSelectedAsList();if(cs===false)return false;var r={ids:cs};if(!this.changeCategoryWindow)this.changeCategoryWindow=MODx.load({xtype:'workflow-chunk-window-change-category',record:r,listeners:{success:{fn:function(r){var sels=this.getSelectionModel().getSelections(),cat=Ext.getCmp('workflow-chunk-category-combo').lastSelectionText,s=this.getStore();for(var i=0;i<sels.length;i=i+1){var id=sels[i].get('id'),ri=id,record=s.getById(ri);record.set("category",cat);record.commit()};this.getSelectionModel().clearSelections(false)},scope:this}}});this.changeCategoryWindow.setValues(r);this.changeCategoryWindow.show(e.target);return true},chunkRemove:function(){var cs=this.getSelectedAsList();if(cs===false)return false;MODx.msg.confirm({title:_('workflow.delete'),text:_('workflow.confirm_delete'),url:this.config.url,params:{action:'mgr/chunk/remove',ids:cs},listeners:{success:{fn:function(r){var sels=this.getSelectionModel().getSelections();if(sels.length<=0)return false;var s=this.getStore();for(var i=0;i<sels.length;i=i+1){var id=sels[i].get('id'),ri=id,record=s.getById(ri);s.remove(record)}},scope:this},failure:{fn:function(r){MODx.msg.alert()},scope:this}}});return true},getBatchMenu:function(){var bm=[];bm.push({text:_('new_category'),handler:this.changeCategory,scope:this},'-',{text:_('remove_chunk')+'(s)',handler:this.chunkRemove,scope:this});return bm}});Ext.reg('workflow-grid-chunk',Workflow.grid.Chunks);Workflow.window.ChangeCategory=function(config){config=config||{};Ext.applyIf(config,{title:_('new_category'),url:Workflow.config.connector_url,baseParams:{action:'mgr/chunk/changecategory'},width:400,fields:[{xtype:'hidden',name:'chunks'},{xtype:'modx-combo-category',id:'workflow-chunk-category-combo',fieldLabel:_('category'),name:'category',hiddenName:'category',anchor:'90%'}]});Workflow.window.ChangeCategory.superclass.constructor.call(this,config)};Ext.extend(Workflow.window.ChangeCategory,MODx.Window);Ext.reg('workflow-chunk-window-change-category',Workflow.window.ChangeCategory)
/* dashboard.grid.js*/
Workflow.grid.DashboardResources=function(config){config=config||{};Ext.applyIf(config,{cls:'workflow-dashboard-grid',url:Workflow.config.connector_url,baseParams:{action:'mgr/resource/getlist'},save_action:'mgr/resource/updatefromgrid',autosave:true,pageSize:8,fields:['id','context_key','pagetitle','description','editedon','deleted','published','publishedon','createdon','menu','status','status_nice','author','preview_url'],columns:[{header:_('id'),dataIndex:'id',width:40,sortable:true},{header:_('pagetitle'),dataIndex:'pagetitle',width:150,editor:{xtype:'textfield',allowBlank:false},sortable:true},{header:_('status'),dataIndex:'status',width:70,editor:{xtype:'workflow-combo-states'},sortable:true,renderer:this._renderStatus},{header:_('user'),dataIndex:'author',width:70,editor:{xtype:'workflow-combo-authors'},sortable:true},{header:_('published'),dataIndex:'published',width:40,editor:{xtype:'combo-boolean',renderer:'boolean'},sortable:true},{header:_('publishedon'),dataIndex:'publishedon',width:100,sortable:true},{header:_('createdon'),dataIndex:'createdon',width:100,sortable:true},{header:_('editedon'),dataIndex:'editedon',width:100,sortable:true}],tbar:[{xtype:'modx-combo-user',id:'workflow-filter-authors',name:'author',emptyText:'Autor',listeners:{change:{fn:this.filterAuthor,scope:this}}},{xtype:'workflow-combo-states',id:'workflow-filter-states',value:'awaiting',name:'state',listeners:{change:{fn:this.filterState,scope:this}}},'-',{xtype:'button',id:'workflow-filter-clear',text:_('filter_clear'),listeners:{click:{fn:this.clearFilter,scope:this}}}],paging:true,listeners:{afterAutoSave:{fn:function(response){this.refresh()},scope:this}}});Workflow.grid.DashboardResources.superclass.constructor.call(this,config)};Ext.extend(Workflow.grid.DashboardResources,MODx.grid.Grid,{_renderStatus:function(value,p,rec){return rec.data.status_nice},preview:function(){window.open(this.config.record.preview_url)},filterAuthor:function(tf,newValue,oldValue){var nv=newValue,s=this.getStore();if(nv==''){delete s.baseParams.author}else s.baseParams.author=nv;this.getBottomToolbar().changePage(1);this.refresh();return true},filterState:function(tf,newValue,oldValue){var nv=newValue,s=this.getStore();if(nv==''){delete s.baseParams.state}else s.baseParams.state=nv;this.getBottomToolbar().changePage(1);this.refresh();return true},clearFilter:function(){s=this.getStore();Ext.getCmp('workflow-filter-states').reset();Ext.getCmp('workflow-filter-authors').reset();delete s.baseParams.state;delete s.baseParams.author;this.getBottomToolbar().changePage(1);this.refresh()},getMenu:function(){return[{text:'Artikel bearbeiten',handler:function(){window.location.href='?a=30&id='+this.menu.record.id},scope:this},{text:'Artikel ansehen',handler:function(){window.open(this.menu.record.preview_url)},scope:this},{text:this.menu.record.published?'Artikel zurückziehen':'Artikel veröffentlichen',handler:this.changePublish,scope:this}]},changePublish:function(btn,e){MODx.Ajax.request({url:Workflow.config.connector_url,params:{action:'mgr/resource/changepublish',pk:this.menu.record.id,id:this.menu.record.id,published:this.menu.record.published}})},updateWorkflow:function(btn,e){if(!this.updateWorkflowWindow)this.updateWorkflowWindow=MODx.load({xtype:'workflow-window-editor',record:this.menu.record,listeners:{success:{fn:this.refresh,scope:this}}});this.updateWorkflowWindow.setValues(this.menu.record);this.updateWorkflowWindow.show(e.target)}});Ext.reg('workflow-grid-resource',Workflow.grid.DashboardResources);Workflow.window.Editor=function(config){config=config||{};Ext.applyIf(config,{title:_('workflow.leave_message.title'),url:Workflow.config.connector_url,baseParams:{action:'mgr/status/change',id:config.record.id},fields:[{xtype:'panel',html:'<strong>#'+config.record.id+'</strong>'},{xtype:'workflow-combo-states',name:'state',value:config.record.status},{xtype:'workflow-combo-authors',name:'author',value:config.record.author},{xtype:'textarea',fieldLabel:_('workflow.window.message'),name:'message',anchor:'100%'},{xtype:'xcheckbox',name:'sendmail',hideLabel:true,boxLabel:_('workflow.window.sendmail')}]});Workflow.window.Editor.superclass.constructor.call(this,config)};Ext.extend(Workflow.window.Editor,MODx.Window);Ext.reg('workflow-window-editor',Workflow.window.Editor);Workflow.combo.States=function(config){var states=new Ext.data.ArrayStore({fields:['display','value'],data:[["Neu","new"],["Wartet auf Veröffentlichung","awaiting"],["Abgewiesen","rejected"],["In Überarbeitung","progress"],["Öffentlich","public"],["Löschung beantragt","deleted"]]});config=config||{};Ext.applyIf(config,{displayField:'display',valueField:'value',store:states,baseParams:{action:'',combo:true},mode:'local',editable:false,emptyText:'Status'});Workflow.combo.States.superclass.constructor.call(this,config)};Ext.extend(Workflow.combo.States,MODx.combo.ComboBox);Ext.reg('workflow-combo-states',Workflow.combo.States);Workflow.combo.Authors=function(config){config=config||{};Ext.applyIf(config,{displayField:'username',valueField:'id',fields:['id','username'],emptyText:'Autor',url:Workflow.config.connector_url,baseParams:{action:'mgr/author/getlist',combo:true}});Workflow.combo.Authors.superclass.constructor.call(this,config)};Ext.extend(Workflow.combo.Authors,MODx.combo.ComboBox);Ext.reg('workflow-combo-authors',Workflow.combo.Authors)
/* home.panel.js*/
Workflow.panel.Home=function(config){config=config||{};Ext.apply(config,{border:false,baseCls:'modx-formpanel',items:[{html:'<h2>workflow</h2>',border:false,cls:'modx-page-header'},{xtype:'modx-tabs',bodyStyle:'padding: 10px',defaults:{border:false,autoHeight:true},border:true,stateful:true,stateId:'workflow-home-tabpanel',stateEvents:['tabchange'],getState:function(){return{activeTab:this.items.indexOf(this.getActiveTab())}},items:[{title:_('workflow.tabs.resources'),defaults:{autoHeight:true},items:[{html:'<p></p>',border:false,bodyStyle:'padding: 10px'},{xtype:'workflow-grid-resource',preventRender:true}]},{title:_('workflow.tabs.states'),defaults:{autoHeight:true},items:[{html:'<p></p>',border:false,bodyStyle:'padding: 10px'},{xtype:'workflow-grid-status',preventRender:true}]},{title:_('workflow.tabs.actions'),defaults:{autoHeight:true},items:[{html:'<p></p>',border:false,bodyStyle:'padding: 10px'},{xtype:'workflow-grid-actions',preventRender:true}]}]}]});Workflow.panel.Home.superclass.constructor.call(this,config)};Ext.extend(Workflow.panel.Home,MODx.Panel);Ext.reg('workflow-panel-home',Workflow.panel.Home)
/* resource.grid.js*/
Workflow.grid.Resources=function(config){config=config||{};this.sm=new Ext.grid.CheckboxSelectionModel();Ext.applyIf(config,{url:Workflow.config.connector_url,baseParams:{action:'mgr/resource/getlist'},autoExpandColumn:'pagetitle',save_action:'mgr/resource/updateFromGrid',autosave:true,pageSize:100,fields:[{name:'id',sortType:Ext.data.SortTypes.asInt},{name:'pagetitle',sortType:Ext.data.SortTypes.asUCString},{name:'published',sortType:Ext.data.SortTypes.asUCString},{name:'publishedon'},{name:'status'},{name:'author'}],paging:true,remoteSort:false,cls:'workflow-grid',sm:this.sm,columns:[this.sm,{header:_('id'),dataIndex:'id',sortable:true,width:50},{header:_('pagetitle'),dataIndex:'pagetitle',sortable:true,width:100},{header:_('published'),dataIndex:'published',sortable:true,width:120},{header:_('publishedon'),dataIndex:'publishedon',sortable:false,width:300},{header:_('status'),dataIndex:'status',sortable:false,width:300,editor:{xtype:'workflow-combo-states'}},{header:_('author'),dataIndex:'author',sortable:false,width:300,editor:{xtype:'workflow-combo-authors'}}],viewConfig:{forceFit:true,enableRowBody:true,showPreview:true,getRowClass:function(rec,ri,p){var cls='workflow-row';if(this.showPreview)return cls+' workflow-resource-expanded';return cls+' workflow-resource-collapsed'}},tbar:[{text:_('workflow.bulkactions'),menu:this.getBatchMenu()}],listeners:{afterAutoSave:{fn:function(response){console.log(response);var w=MODx.load({xtype:'workflow-window-editor',record:response.object,listeners:{success:{fn:this.refresh,scope:this}}});w.setValues(response.object);w.show()},scope:this}}});Workflow.grid.Resources.superclass.constructor.call(this,config)};Ext.extend(Workflow.grid.Resources,MODx.grid.Grid,{reloadResources:function(){this.getStore().baseParams={action:'mgr/resource/getList',orphanSearch:'modResource'};this.getBottomToolbar().changePage(1);this.refresh()},_showMenu:function(g,ri,e){e.stopEvent();e.preventDefault();this.menu.record=this.getStore().getAt(ri).data;if(!this.getSelectionModel().isSelected(ri))this.getSelectionModel().selectRow(ri);this.menu.removeAll();var m=[];if(this.menu.record.menu){m=this.menu.record.menu;if(m.length>0){this.addContextMenuItem(m);this.menu.show(e.target)}}else{var z=this.getBatchMenu();for(var zz=0;zz<z.length;zz++)this.menu.add(z[zz]);this.menu.show(e.target)}},getSelectedAsList:function(){var sels=this.getSelectionModel().getSelections();if(sels.length<=0)return false;var cs='';for(var i=0;i<sels.length;i++)cs+=','+sels[i].data.id;cs=Ext.util.Format.substr(cs,1);return cs},changeCategory:function(btn,e){var cs=this.getSelectedAsList();if(cs===false)return false;var r={ids:cs};if(!this.changeCategoryWindow)this.changeCategoryWindow=MODx.load({xtype:'workflow-chunk-window-change-category',record:r,listeners:{success:{fn:function(r){var sels=this.getSelectionModel().getSelections(),cat=Ext.getCmp('workflow-chunk-category-combo').lastSelectionText,s=this.getStore();for(var i=0;i<sels.length;i=i+1){var id=sels[i].get('id'),ri=id,record=s.getById(ri);record.set("category",cat);record.commit()};this.getSelectionModel().clearSelections(false)},scope:this}}});this.changeCategoryWindow.setValues(r);this.changeCategoryWindow.show(e.target);return true},getBatchMenu:function(){var bm=[];bm.push({text:_('workflow.edit'),handler:this.updateWorkflow,scope:this});return bm},updateWorkflow:function(btn,e){console.log(this.menu.record);if(!this.updateWorkflowWindow)this.updateWorkflowWindow=MODx.load({xtype:'workflow-window-editor',record:this.menu.record,listeners:{success:{fn:this.refresh,scope:this}}});this.updateWorkflowWindow.setValues(this.menu.record);this.updateWorkflowWindow.show(e.target)}});Ext.reg('workflow-grid-resource',Workflow.grid.Resources);Workflow.window.Editor=function(config){config=config||{};console.log(config);Ext.applyIf(config,{title:_('workflow.leave_message.title'),url:Workflow.config.connector_url,baseParams:{action:'mgr/status/change',id:config.record.id},fields:[{xtype:'panel',html:'<strong>#'+config.record.id+'</strong>'},{xtype:'workflow-combo-states',name:'state',value:config.record.status},{xtype:'workflow-combo-authors',name:'author',value:config.record.author},{xtype:'textarea',fieldLabel:_('workflow.window.message'),name:'message',anchor:'100%'},{xtype:'xcheckbox',name:'sendmail',hideLabel:true,boxLabel:_('workflow.window.sendmail')}]});Workflow.window.Editor.superclass.constructor.call(this,config)};Ext.extend(Workflow.window.Editor,MODx.Window);Ext.reg('workflow-window-editor',Workflow.window.Editor);Workflow.combo.States=function(config){config=config||{};Ext.applyIf(config,{store:['approved','hidden','pending','auto_approved'],baseParams:{action:'',combo:true},mode:'local',editable:false});Workflow.combo.States.superclass.constructor.call(this,config)};Ext.extend(Workflow.combo.States,MODx.combo.ComboBox);Ext.reg('workflow-combo-states',Workflow.combo.States);Workflow.combo.Authors=function(config){config=config||{};Ext.applyIf(config,{displayField:'username',valueField:'id',fields:['id','username'],url:Workflow.config.connectorUrl,baseParams:{action:'mgr/author/getlist',combo:true}});Workflow.combo.Authors.superclass.constructor.call(this,config)};Ext.extend(Workflow.combo.Authors,MODx.combo.ComboBox);Ext.reg('workflow-combo-authors',Workflow.combo.Authors)
/* snippet.grid.js*/
Workflow.grid.Snippets=function(config){config=config||{};this.sm=new Ext.grid.CheckboxSelectionModel();Ext.applyIf(config,{url:Workflow.config.connector_url,baseParams:{action:'mgr/snippet/getlist',thread:config.thread},pageSize:300,fields:[{name:'id',sortType:Ext.data.SortTypes.asInt},{name:'name',sortType:Ext.data.SortTypes.asUCString},{name:'category',sortType:Ext.data.SortTypes.asUCString},{name:'description'}],paging:true,autosave:false,remoteSort:false,autoExpandColumn:'description',cls:'workflow-grid',sm:this.sm,columns:[this.sm,{header:_('id'),dataIndex:'id',sortable:true,width:50},{header:_('name'),dataIndex:'name',sortable:true,width:100},{header:_('category'),dataIndex:'category',sortable:true,width:120},{header:_('description'),dataIndex:'description',sortable:false,width:300}],viewConfig:{forceFit:true,enableRowBody:true,showPreview:true,getRowClass:function(rec,ri,p){var cls='workflow-row';if(this.showPreview)return cls+' workflow-resource-expanded';return cls+' workflow-resource-collapsed'}},tbar:[{text:'Bulk Actions',menu:this.getBatchMenu()},{xtype:'tbspacer',width:200},{xtype:'button',id:'workflow-snippets-reload',text:'reload',listeners:{click:{fn:this.reloadSnippets,scope:this}}}]});Workflow.grid.Snippets.superclass.constructor.call(this,config)};Ext.extend(Workflow.grid.Snippets,MODx.grid.Grid,{reloadSnippets:function(){this.getStore().baseParams={action:'mgr/snippet/getList',orphanSearch:'modSnippet'};this.getBottomToolbar().changePage(1);this.refresh()},_showMenu:function(g,ri,e){e.stopEvent();e.preventDefault();this.menu.record=this.getStore().getAt(ri).data;if(!this.getSelectionModel().isSelected(ri))this.getSelectionModel().selectRow(ri);this.menu.removeAll();var m=[];if(this.menu.record.menu){m=this.menu.record.menu;if(m.length>0){this.addContextMenuItem(m);this.menu.show(e.target)}}else{var z=this.getBatchMenu();for(var zz=0;zz<z.length;zz++)this.menu.add(z[zz]);this.menu.show(e.target)}},getSelectedAsList:function(){var sels=this.getSelectionModel().getSelections();if(sels.length<=0)return false;var cs='';for(var i=0;i<sels.length;i++)cs+=','+sels[i].data.id;cs=Ext.util.Format.substr(cs,1);return cs},changeCategory:function(btn,e){var cs=this.getSelectedAsList();if(cs===false)return false;var r={ids:cs};if(!this.changeCategoryWindow)this.changeCategoryWindow=MODx.load({xtype:'workflow-snippet-window-change-category',record:r,listeners:{success:{fn:function(r){var sels=this.getSelectionModel().getSelections(),cat=Ext.getCmp('workflow-snippet-category-combo').lastSelectionText,s=this.getStore();for(var i=0;i<sels.length;i=i+1){var id=sels[i].get('id'),ri=id,record=s.getById(ri);record.set("category",cat);record.commit()};this.getSelectionModel().clearSelections(false)},scope:this}}});this.changeCategoryWindow.setValues(r);this.changeCategoryWindow.show(e.target);return true},snippetRemove:function(){var cs=this.getSelectedAsList();if(cs===false)return false;MODx.msg.confirm({title:_('workflow.delete'),text:_('workflow.confirm_delete'),url:this.config.url,params:{action:'mgr/snippet/remove',ids:cs},listeners:{success:{fn:function(r){var sels=this.getSelectionModel().getSelections();if(sels.length<=0)return false;var s=this.getStore();for(var i=0;i<sels.length;i=i+1){var id=sels[i].get('id'),ri=id,record=s.getById(ri);s.remove(record)}},scope:this},failure:{fn:function(r){MODx.msg.alert()},scope:this}}});return true},getBatchMenu:function(){var bm=[];bm.push({text:_('new_category'),handler:this.changeCategory,scope:this},'-',{text:_('remove_snippet')+'(s)',handler:this.snippetRemove,scope:this});return bm}});Ext.reg('workflow-grid-snippet',Workflow.grid.Snippets);Workflow.window.ChangeCategory=function(config){config=config||{};Ext.applyIf(config,{title:_('new_category'),url:Workflow.config.connector_url,baseParams:{action:'mgr/snippet/changecategory'},width:400,fields:[{xtype:'hidden',name:'snippets'},{xtype:'modx-combo-category',id:'workflow-snippet-category-combo',fieldLabel:_('category'),name:'category',hiddenName:'category',anchor:'90%'}]});Workflow.window.ChangeCategory.superclass.constructor.call(this,config)};Ext.extend(Workflow.window.ChangeCategory,MODx.Window);Ext.reg('workflow-snippet-window-change-category',Workflow.window.ChangeCategory)
/* status.grid.js*/
Workflow.grid.States=function(config){config=config||{};this.sm=new Ext.grid.CheckboxSelectionModel();Ext.applyIf(config,{url:Workflow.config.connector_url,baseParams:{action:'mgr/status/getlist'},autoExpandColumn:'pagetitle',save_action:'mgr/status/updateFromGrid',autosave:true,pageSize:100,fields:[{name:'id',sortType:Ext.data.SortTypes.asInt},{name:'pagetitle',sortType:Ext.data.SortTypes.asUCString},{name:'published',sortType:Ext.data.SortTypes.asUCString},{name:'publishedon'},{name:'status'},{name:'author'}],paging:true,remoteSort:false,cls:'workflow-grid',sm:this.sm,columns:[this.sm,{header:_('id'),dataIndex:'id',sortable:true,width:50},{header:_('pagetitle'),dataIndex:'pagetitle',sortable:true,width:100},{header:_('published'),dataIndex:'published',sortable:true,width:120},{header:_('publishedon'),dataIndex:'publishedon',sortable:false,width:300},{header:_('status'),dataIndex:'status',sortable:false,width:300,editor:{xtype:'workflow-combo-states'}},{header:_('author'),dataIndex:'author',sortable:false,width:300,editor:{xtype:'workflow-combo-authors'}}],viewConfig:{forceFit:true,enableRowBody:true,showPreview:true,getRowClass:function(rec,ri,p){var cls='workflow-row';if(this.showPreview)return cls+' workflow-status-expanded';return cls+' workflow-status-collapsed'}},tbar:[{text:_('workflow.bulkactions'),menu:this.getBatchMenu()}],listeners:{afterAutoSave:{fn:function(response){console.log(response);var w=MODx.load({xtype:'workflow-window-editor',record:response.object,listeners:{success:{fn:this.refresh,scope:this}}});w.setValues(response.object);w.show()},scope:this}}});Workflow.grid.States.superclass.constructor.call(this,config)};Ext.extend(Workflow.grid.States,MODx.grid.Grid,{reloadStates:function(){this.getStore().baseParams={action:'mgr/status/getList',orphanSearch:'modResource'};this.getBottomToolbar().changePage(1);this.refresh()},_showMenu:function(g,ri,e){e.stopEvent();e.preventDefault();this.menu.record=this.getStore().getAt(ri).data;if(!this.getSelectionModel().isSelected(ri))this.getSelectionModel().selectRow(ri);this.menu.removeAll();var m=[];if(this.menu.record.menu){m=this.menu.record.menu;if(m.length>0){this.addContextMenuItem(m);this.menu.show(e.target)}}else{var z=this.getBatchMenu();for(var zz=0;zz<z.length;zz++)this.menu.add(z[zz]);this.menu.show(e.target)}},getSelectedAsList:function(){var sels=this.getSelectionModel().getSelections();if(sels.length<=0)return false;var cs='';for(var i=0;i<sels.length;i++)cs+=','+sels[i].data.id;cs=Ext.util.Format.substr(cs,1);return cs},changeCategory:function(btn,e){var cs=this.getSelectedAsList();if(cs===false)return false;var r={ids:cs};if(!this.changeCategoryWindow)this.changeCategoryWindow=MODx.load({xtype:'workflow-chunk-window-change-category',record:r,listeners:{success:{fn:function(r){var sels=this.getSelectionModel().getSelections(),cat=Ext.getCmp('workflow-chunk-category-combo').lastSelectionText,s=this.getStore();for(var i=0;i<sels.length;i=i+1){var id=sels[i].get('id'),ri=id,record=s.getById(ri);record.set("category",cat);record.commit()};this.getSelectionModel().clearSelections(false)},scope:this}}});this.changeCategoryWindow.setValues(r);this.changeCategoryWindow.show(e.target);return true},getBatchMenu:function(){var bm=[];bm.push({text:_('workflow.edit'),handler:this.updateWorkflow,scope:this});return bm},updateWorkflow:function(btn,e){console.log(this.menu.record);if(!this.updateWorkflowWindow)this.updateWorkflowWindow=MODx.load({xtype:'workflow-window-editor',record:this.menu.record,listeners:{success:{fn:this.refresh,scope:this}}});this.updateWorkflowWindow.setValues(this.menu.record);this.updateWorkflowWindow.show(e.target)}});Ext.reg('workflow-grid-status',Workflow.grid.States);Workflow.window.Editor=function(config){config=config||{};console.log(config);Ext.applyIf(config,{title:_('workflow.leave_message.title'),url:Workflow.config.connector_url,baseParams:{action:'mgr/status/change',id:config.record.id},fields:[{xtype:'panel',html:'<strong>#'+config.record.id+'</strong>'},{xtype:'workflow-combo-states',name:'state',value:config.record.status},{xtype:'workflow-combo-authors',name:'author',value:config.record.author},{xtype:'textarea',fieldLabel:_('workflow.window.message'),name:'message',anchor:'100%'},{xtype:'xcheckbox',name:'sendmail',hideLabel:true,boxLabel:_('workflow.window.sendmail')}]});Workflow.window.Editor.superclass.constructor.call(this,config)};Ext.extend(Workflow.window.Editor,MODx.Window);Ext.reg('workflow-window-editor',Workflow.window.Editor);Workflow.combo.States=function(config){config=config||{};Ext.applyIf(config,{store:['approved','hidden','pending','auto_approved'],baseParams:{action:'',combo:true},mode:'local',editable:false});Workflow.combo.States.superclass.constructor.call(this,config)};Ext.extend(Workflow.combo.States,MODx.combo.ComboBox);Ext.reg('workflow-combo-states',Workflow.combo.States)
/* workflow.button.plugin.js*/
Ext.onReady(function(){var panel=Ext.getCmp('modx-panel-resource');if(!panel)return;var modab=Ext.getCmp("modx-action-buttons");modab.insert(12,'-');modab.insert(12,{xtype:'button',text:'Nachricht an Autor',id:'modx-abtn-workflow-send',handler:function(){MODx.Ajax.request({url:Workflow.config.connector_url,params:{action:'mgr/author/get',id:MODx.request.id},listeners:{success:{fn:function(r){console.log(r);window.location='mailto:'+r.object.author.email+'?subject='+r.object.resource.pagetitle+'&body=Betreffend '+r.object.resource.pagetitle},scope:this}}})}});modab.doLayout()})
/* workflow.js*/
if(!Workflow){var Workflow=function(config){config=config||{};Workflow.superclass.constructor.call(this,config)};Ext.extend(Workflow,Ext.Component,{page:{},window:{},grid:{},tree:{},panel:{},combo:{},config:{}});Ext.reg('workflow',Workflow);var Workflow=new Workflow()}
/* workflow.plugin.js*/

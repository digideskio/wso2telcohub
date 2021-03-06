==============================
Incident: 
MIFE-638 
Title - Hub admin can not be able to login to sandbox
Description - The hub admin (admin/admin) was not able to login to the sandbox. However SP users were able to login.

MIFE-683
Title - Service providers who has aggrigator role cannot login to sandbox after token is regenrated
Description - Service providers who has aggrigator role cannot login to sandbox after token is regenrated
==============================

Please perform below modifications to the current HUB deployment;

2) Apply 'AxiataMediator-1.0.0.jar' changes on puppet master;
	a) On puppet master, navigate to "/mnt/puppet/environments/qa_rel_160/modules/apimanager/files/patches".
	b) Create the folder structure "repository/deployment/server/jaggeryapps/" inside the above directory. (Backup the content if folder structure already exists.)
	c) Copy and paste the folder "sandbox" in to pupet master folder navigated to in step b). (Patch source is available under "/wso2am-1.7.0/jaggeryapps/".)
 	d) Go to agent node where wso2am-1.7.0 is already deployed and backup the same files in the actual deployment, mapping to the patched source file path. These original files before applying the patch will be needed to revert the patch changes if required.  
  
  	The actual deployment path is as follows;
  	<AGNET_NODE>/mnt/<ip_address>/wso2am-1.7.0/repository/deployment/server/jaggeryapps/


2) Sync changes on agent nodes;
	a) Restart apache2 service on puppet master.
	b) Run below puppet agent command on agent containing AM instance for the changes to reflect;
		> puppet agent --enable; puppet agent -vt --http_compression; puppet agent --disable;

 

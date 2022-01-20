## This repository contains files used for [Finto AI service](https://ai.finto.fi/)

The components of the service are combined in a Docker Stack, which is set up using Portainer GUI. 
The Stack do not automatically follow the `docker-compose-ai.finto-fi.yaml` file, it is here to allow easier referencing to the Stack configuration. 

The content for the web page is in the `ai.finto.fi` directory. The testing domain [ai.dev.finto.fi](https://ai.dev.finto.fi) uses the same content.


## Data deployment for the service

The directory `/srv/annif-data/{service-domain}` at annif-kk is transferred/synced to the `data` volume of the Stack corresponding to the service domain. 

1. In Portainer Stacks view open the Stack that corresponds to the API instance for which the deployment is being performed.
  
2. Begin data sync by starting the container `{stack-name}_modeldata-sync` by scaling its desired number (under the column "Scheduling Mode") from 0 to 1 (or from 1 to 2 etc. if needed). A full transfer takes about half hour. Sync progress can be monitored in Graylog (in Annif dashboards there is a separate panel showing logs from the sync containers).

3. When the sync is finished (status of the modeldata-sync container is "complete"), put the new data in use by restarting Annif container by selecting its checkbox from the container list and choose update. It is not necessary to "pull latest image".


Webpage content can be similarly updated using the "{stack-name}_webdata-sync" container, which pulls the directory from this repository to `webdata` volume using svn client. The modified content is used without restarting NGINX. 

[<img src="https://raw.githubusercontent.com/NatLibFi/FintoAI/master/ai.finto.fi/static/img/finto-ai-social.png" width="200">](https://ai.finto.fi)

# NOTE: THIS IS WIP

Finto AI suggests subjects for a given text. It's based on [Annif](https://annif.org), a tool for automated subject indexing.
Finto AI is also an API service that can be integrated to other systems.

This repository contains files used for the service. The service is run on OpenShift Container Platform (OCP) cluster.

# Service components

- Annif application
- NGINX proxy server also serving the webpage
- [Matomo log-analytics](https://github.com/natlibfi/matomo-log-analytics) gathering usage statistics

## Logging

Cluster-level log service is Kibana. There is a dashboard with a panels for the logs from each component.

# Service deployment

OpenShift CLI and [Helm CLI](https://helm.sh/docs/intro/install/) applications (`oc` and `helm`) are needed.
You also need to be logged in to the OCP test or production cluster with the `oc`:

    oc login -u <username> https://api.<OCP_cluster_domain>:6443

A service instance is deployed using helm-charts in the `helm-charts/` directory. The `helm-charts/templates/` subdirectory
contains the common resource definition files, and the files `values-ai.finto.fi.yaml` and `values-ai.dev.finto.fi.yaml`
contain the configurations that are specific for the test and production
instances (named `ai-dev-finto-fi` and `ai-finto-fi`).

The command to install or update the test instance, with all the components, is

    helm upgrade --install -f values-ai.dev.finto.fi.yaml ai-dev-finto-fi .

The necessary secrets are managed in the OCP web console.

## Model updates

There is a script `sync-model-data-ocp.sh` on the kj-kk server in `annif-data`
directory that uses rsync to copy a selected instance directory from the server to an
instance volume on the OCP cluster. For example

    ./sync-model-data-ocp.sh ai.finto.fi ai-dev-finto-fi

After the data transfer the updated models are put in use by restarting the
Annif pod:

    oc rollout restart deployment/ai-dev-finto-fi-annif

## Webpage updates

Webpage content can be updated by running

    oc start-build ai-dev-finto-fi-nginx

This builds and deploys a new nginx image that includes the (updated) content from
`ai.finto.fi/` of this repository. For the test instance a webhook trigger starts builds
automatically for every push to the repository.

# Useful `oc` commands

Show the status of the project

    oc status

List the pods of the project

    oc get pods  # --show-labels

List the pods of the test instance using a label selector (build/deploy pods are excluded)

    oc get pods -l app.kubernetes.io/instance=ai-dev-finto-fi

List all resources of the test instance

    oc get all -l app.kubernetes.io/instance=ai-dev-finto-fi

Follow logs from the pods of the test instance

    oc logs -l app.kubernetes.io/instance=ai-dev-finto-fi -f  #--timestamps

Get details of the pods of the test instance

    oc describe pods -l app.kubernetes.io/instance=ai-dev-finto-fi

Open remote bash to Annif pod

     oc rsh deployment/ai-dev-finto-fi-annif bash


Full list of commands available [here](https://docs.openshift.com/container-platform/4.7/cli_reference/openshift_cli/developer-cli-commands.html).

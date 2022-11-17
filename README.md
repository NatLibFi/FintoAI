# Test instance with only Annif

The helm-charts in this branch create helm release with Annif as the only application and publish its web UI in address dev.annif.org.

To quickly create a new instance with a new address in cluster domain:
- edit helm-charts and/or values files (if necessary)
  - Annif image version/tag is set in `values.yaml`
- log in to the test OCP cluster with `oc` (if not already logged in)
- while in helm-charts directory run `helm upgrade --install <name-of-the-release> .`
- the service becomes available in address \<name-of-the-release\>.<test-cluste>

/* eslint-disable max-len */

exports.no_changes = `{
    "master01.nfp.local": {
        "cmd_|-service_|-forever restart node_salt_|-run": {
            "comment": "State was not run because none of the onchanges reqs changed",
            "__run_num__": 4,
            "__sls__": "deploy.node_salt",
            "changes": {},
            "result": true
        },
        "npm_|-npm_|-/home/node/node_salt_|-bootstrap": {
            "comment": "State was not run because none of the onchanges reqs changed",
            "__run_num__": 1,
            "__sls__": "deploy.node_salt",
            "changes": {},
            "result": true
        },
        "cmd_|-startup_|-forever-service install node_salt -r node --start -s index.js -f \\" -o /var/log/node/salt_node.out.log -e /var/log/node/salt_node.err.log\\"_|-run": {
            "comment": "unless execution succeeded",
            "name": "forever-service install node_salt -r node --start -s index.js -f \\" -o /var/log/node/salt_node.out.log -e /var/log/node/salt_node.err.log\\"",
            "start_time": "00:35:28.508491",
            "skip_watch": true,
            "result": true,
            "duration": 1117.88,
            "__run_num__": 3,
            "changes": {}
        },
        "git_|-project_|-https://github.com/nfp-projects/node_salt.git_|-latest": {
            "comment": "Repository /home/node/node_salt is up-to-date",
            "name": "https://github.com/nfp-projects/node_salt.git",
            "start_time": "00:35:25.794061",
            "result": true,
            "duration": 2046.492,
            "__run_num__": 0,
            "changes": {}
        },
        "file_|-config_|-/home/node/node_salt/config/config.json_|-managed": {
            "comment": "File /home/node/node_salt/config/config.json is in the correct state",
            "name": "/home/node/node_salt/config/config.json",
            "start_time": "00:35:28.118455",
            "result": true,
            "duration": 389.122,
            "__run_num__": 2,
            "changes": {}
        }
    }
}`

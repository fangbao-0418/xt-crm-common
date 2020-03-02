import { Config } from 'yapi-to-typescript'

const config: Config = [
  {
    serverUrl: 'http://192.168.20.21',
    typesOnly: true,
    reactHooks: {
      enable: false
    },
    prodEnvName: 'local',
    dataKey: 'data',
    projects: [
      {
        token: '45fb035c935cd7e361801f333da0ef792fcae7c05ddfb73abb25fb6fad7de887',
        categories: [
          {
            /** 调整单 */
            id: 15164,
            getRequestFunctionName (interfaceInfo, changeCase) {
              const name = changeCase.camelCase(
                interfaceInfo.parsedPath.name
              )
              return name
            },
            outputFilePath: 'yapi/adjustment/interface.d.ts'
          }
        ]
      }
    ]
  }
]

export default config
const generateXmlSaida = (params: {
    authentication: { user: string; password: string };
    portal: number;
    name: string;
    chave: string;
    cnpj_emp: string;
    extraParameters: Object;
}) => {
    return `<?xml version='1.0' encoding='utf-8' ?>
    <LinxMicrovix>
        <Authentication user='${params.authentication.user}' password='${params.authentication.password
        }' />
        <ResponseFormat>json</ResponseFormat>
        <IdPortal>${params.portal}</IdPortal>
        <Command>
            <Name>${params.name}</Name>
            <Parameters>
                <Parameter id='chave'>${params.chave}</Parameter>
                <Parameter id='cnpjEmp'>${params.cnpj_emp}</Parameter>
                ${Object.keys(params.extraParameters).map(key => {
                    if(params.extraParameters[key] !== undefined || params.extraParameters[key] !== null) {
                        return `
                            <Parameter id='${key}'>${params.extraParameters[key]}</Parameter>
                        `
                    }
                }).join(' ')}
            </Parameters>
        </Command>
    </LinxMicrovix>`;
}

const generateXmlEntrada = (params: {
    authentication: { user: string; password: string };
    portal: number;
    name: string;
    chave: string;
    cnpj_emp: string;
    commandParameters: object;
}) => {
    return `<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/'
                        xmlns:tem='http://tempuri.org/'
                        xmlns:linx='http://schemas.datacontract.org/2004/07/Linx.Microvix.WebApi.Importacao.Requests'
                        xmlns:linx1='http://schemas.datacontract.org/2004/07/Linx.Microvix.WebApi.Business.Api'
                        xmlns:linx2='http://schemas.datacontract.org/2004/07/Linx.Microvix.WebApi.Importacao'>
                <soapenv:Header/>
                <soapenv:Body>
                    <tem:Importar>
                        <tem:request>
                            <linx:ParamsSeletorDestino>
                                <linx1:CommandParameter>
                                    <linx1:Name>chave</linx1:Name>
                                    <linx1:Value>${params.chave}</linx1:Value>
                                </linx1:CommandParameter>
                                <linx1:CommandParameter>
                                    <linx1:Name>cnpjEmp</linx1:Name>
                                    <linx1:Value>${params.cnpj_emp}</linx1:Value>
                                </linx1:CommandParameter>
                                <linx1:CommandParameter>
                                        <linx1:Name>IdPortal</linx1:Name>
                                        <linx1:Value>${params.portal}</linx1:Value>
                                    </linx1:CommandParameter>
                            </linx:ParamsSeletorDestino>
                            <linx:Tabela>
                                <linx2:Comando>${params.name}</linx2:Comando>
                                <linx2:Registros>
                                    <linx:Registros>
                                        <linx:Colunas>
                                            ${Object.keys(params.commandParameters).map(key => {
                                                if(params.commandParameters[key]) {
                                                    return `
                                                        <linx1:CommandParameter>
                                                            <linx1:Name>${key}</linx1:Name>
                                                            <linx1:Value>${params.commandParameters[key]}</linx1:Value>
                                                        </linx1:CommandParameter>
                                                    `
                                                }
                                            }).join(' ')}
                                        </linx:Colunas>
                                    </linx:Registros>
                                </linx2:Registros>
                            </linx:Tabela>
                            <linx:UserAuth>
                                <linx2:Pass>${params.authentication.password}</linx2:Pass>
                                <linx2:User>${params.authentication.user}</linx2:User>
                            </linx:UserAuth>
                        </tem:request>
                    </tem:Importar>
                </soapenv:Body>
            </soapenv:Envelope>`;
}

export {
    generateXmlEntrada,
    generateXmlSaida
}
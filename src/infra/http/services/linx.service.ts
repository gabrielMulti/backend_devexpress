import axios from "axios";
import { CustomError } from "src/exceptions/error-custom";

export class LinxService {
    typesWebServise = {
        entrada: {
            url: 'https://webapi.microvix.com.br/1.0/importador.svc',
            headers: {
                "Content-Type": "text/xml;charset=UTF-8",
                "Accept": "text/xml",
                "SOAPAction": "http://tempuri.org/IImportador/Importar"
            },
        },
        aceitacao: {
            url: 'https://webapi.microvix.com.br/1.0/importador.svc',
            headers: {
                "Content-Type": "text/xml;charset=UTF-8",
                "Accept": "text/xml",
                "SOAPAction": "http://tempuri.org/IImportador/Importar"
            },
        },
        saida: {
            url: 'https://webapi.microvix.com.br/1.0/api/integracao',
            headers: {
                "Content-Type": "text/xml",
                "Accept": "application/json",
            },
        }
    };

    async executeXml(params: { xml: string, type: 'entrada' | 'saida' | 'aceitacao' }): Promise<any> {
        try {
            return await axios.post(this.typesWebServise[params.type].url, params.xml, {
                headers: this.typesWebServise[params.type].headers
            }).then(responseLinx => {
                let resObj: any;
                if (responseLinx.data?.ResponseData) {
                    resObj = responseLinx.data.ResponseData[0];
                } else {
                    try {
                        resObj = JSON.parse(responseLinx.data.replace(/,(\s*\n*])/gm, "$1").replace(/\\/g, "/")).ResponseData[0];
                    } catch (error: any) {
                        if(
                            String(responseLinx.data).search('<a:Succeeded>false</a:Succeeded>') !== -1 ||
                            String(responseLinx.data).search('<ResponseSuccess>False</ResponseSuccess>') !== -1
                        ) throw new Error(responseLinx.data)
                        resObj = responseLinx.data;
                    }
                }

                return resObj;
            })

        } catch (error: any) {
            throw new CustomError({ message: error.message, code: 500 });
        }

    }
}
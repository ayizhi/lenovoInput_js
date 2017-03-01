/**
 * This is a Mock demo for dev
 * @param api: [string] rquest Url
 * @param response: request callback
 */
module.exports = {

    // request url
    api: '/insurance/employeeDetail',

    // return
    response: (req, res) => {
        res.send({
            status: true,
            data: { 
                employeeId: '4634f76b3da543108d55f52e246db129',
                houseFundCity: 510,
                socialInsuranceCity: 510,
                entryTime: '2016-11-29',
                departmentName: '',
                socialInsuranceBase: '0',
                dismissionTime: '',
                jobNumber: '',
                socialInsuranceCityName: { province: '北京市', district: '朝阳区', city: '北京市' },
                houseFundBase: '1',
                name: 'ceshi',
                departmentId: '',
                houseFundCityName: { province: '北京市', district: '朝阳区', city: '北京市' },
                mobile: '19029303978',
                hireTypeOptions: [
                    {value:0 , label: '正式'},
                    {value:1 , label: '非正式'}
                ],
                hireType: 0,
                regularDate: '2017-02-07',
                employeePic: {
                    fileName: '屏幕快照 2017-02-21 下午6.17.50.png',
                    fileId: '69457d9fe14b11e68ce900163e033d82',
                    fileValue: 'VxxR8coAN43ujHONQcTwqTVlZjlmNjQzYTVhOWY4M2NjMmQ2NDUyYzM3ZTRiMGE3NTllOWJmZTJmMDIxMTEyZjQzNGM1ZWI3NDc4NDI4OWTDN19JK0rfBtI9zAp',
                    fileUrl: "/static/img/lala.a6c8b5b.png"
                }


                

            },
        })
    }
}


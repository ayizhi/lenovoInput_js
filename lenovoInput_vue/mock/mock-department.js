/**
 * This is a Mock demo for dev
 * @param api: [string] rquest Url
 * @param response: request callback
 */
module.exports = {

    // request url
    api: '/company/department',

    // return
    response: (req, res) => {
        if (req.query.hasRoot == 1){
            console.log('send has root...')
            //root
            res.send({"code":0,"message":"获取数据成功","status":true,"data":[{"id":"70d7d4f9e30541a5a640c29a4cfe6e38","name":"企家有道测试-艳雪&lt;&gt;","parentId":"0","isAuth":true,"childrenIds":["42bb7a6d83d6427dbf148c56045b4858","61f50a2fb89740f9929d62c3f8435a61","84762e69b14b4929ba64375fc997ad51"],"children":[{"id":"42bb7a6d83d6427dbf148c56045b4858","name":"人事部","parentId":"70d7d4f9e30541a5a640c29a4cfe6e38","isAuth":true,"childrenIds":["4677a2c945a64f199c4e44919251856f","dc406f8b7255480491d85f3d18893596","fc31941d07174bff84ac57367eaaa6e2"],"children":[{"id":"4677a2c945a64f199c4e44919251856f","name":"考勤","parentId":"42bb7a6d83d6427dbf148c56045b4858","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944155,"modtime":1481944155},{"id":"dc406f8b7255480491d85f3d18893596","name":"HR","parentId":"42bb7a6d83d6427dbf148c56045b4858","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944132,"modtime":1481944132},{"id":"fc31941d07174bff84ac57367eaaa6e2","name":"财务","parentId":"42bb7a6d83d6427dbf148c56045b4858","isAuth":true,"childrenIds":["156e9b369c7e4666aabf56a9ceada6d7","d557d9c9d7fe40a4905b441d67bc79bd"],"children":[{"id":"156e9b369c7e4666aabf56a9ceada6d7","name":"工资","parentId":"fc31941d07174bff84ac57367eaaa6e2","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944174,"modtime":1481944174},{"id":"d557d9c9d7fe40a4905b441d67bc79bd","name":"社保","parentId":"fc31941d07174bff84ac57367eaaa6e2","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944182,"modtime":1481944182}],"addtime":1481944145,"modtime":1481944145}],"addtime":1481944063,"modtime":1481944063},{"id":"61f50a2fb89740f9929d62c3f8435a61","name":"职能部","parentId":"70d7d4f9e30541a5a640c29a4cfe6e38","isAuth":true,"childrenIds":["245b47de9b124bb29856d12ce50f3840","badc0c74d11848999a8a6b7c328f965f"],"children":[{"id":"245b47de9b124bb29856d12ce50f3840","name":"后勤","parentId":"61f50a2fb89740f9929d62c3f8435a61","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944122,"modtime":1481944122},{"id":"badc0c74d11848999a8a6b7c328f965f","name":"前台","parentId":"61f50a2fb89740f9929d62c3f8435a61","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944115,"modtime":1481944115}],"addtime":1481944050,"modtime":1481944050},{"id":"84762e69b14b4929ba64375fc997ad51","name":"技术部","parentId":"70d7d4f9e30541a5a640c29a4cfe6e38","isAuth":true,"childrenIds":["c6926f68a224447fbe25a5c04f8428b2","fb8dc62c84c74c00bdb608060f9a02e5"],"children":[{"id":"c6926f68a224447fbe25a5c04f8428b2","name":"研发部","parentId":"84762e69b14b4929ba64375fc997ad51","isAuth":true,"childrenIds":["b5cae02ede9a47f0999d80ab04806fd0","f4381eea73bc446fab98204054c2b445"],"children":[{"id":"b5cae02ede9a47f0999d80ab04806fd0","name":"前端&lt;a&gt;","parentId":"c6926f68a224447fbe25a5c04f8428b2","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944097,"modtime":1481944097},{"id":"f4381eea73bc446fab98204054c2b445","name":"后端","parentId":"c6926f68a224447fbe25a5c04f8428b2","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944105,"modtime":1481944105}],"addtime":1481944072,"modtime":1481944072},{"id":"fb8dc62c84c74c00bdb608060f9a02e5","name":"test","parentId":"84762e69b14b4929ba64375fc997ad51","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944085,"modtime":1481944085}],"addtime":1481944038,"modtime":1481944038}],"addtime":1481941331,"modtime":1481941331}]})

        }else if(req.query.hasRoot == 0){
            console.log('send no root...')
            
            //noRoot
            res.send({"code":0,"message":"获取数据成功","status":true,"data":[{"id":"42bb7a6d83d6427dbf148c56045b4858","name":"人事部","parentId":"70d7d4f9e30541a5a640c29a4cfe6e38","isAuth":true,"childrenIds":["4677a2c945a64f199c4e44919251856f","dc406f8b7255480491d85f3d18893596","fc31941d07174bff84ac57367eaaa6e2"],"children":[{"id":"4677a2c945a64f199c4e44919251856f","name":"考勤","parentId":"42bb7a6d83d6427dbf148c56045b4858","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944155,"modtime":1481944155},{"id":"dc406f8b7255480491d85f3d18893596","name":"HR","parentId":"42bb7a6d83d6427dbf148c56045b4858","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944132,"modtime":1481944132},{"id":"fc31941d07174bff84ac57367eaaa6e2","name":"财务","parentId":"42bb7a6d83d6427dbf148c56045b4858","isAuth":true,"childrenIds":["156e9b369c7e4666aabf56a9ceada6d7","d557d9c9d7fe40a4905b441d67bc79bd"],"children":[{"id":"156e9b369c7e4666aabf56a9ceada6d7","name":"工资","parentId":"fc31941d07174bff84ac57367eaaa6e2","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944174,"modtime":1481944174},{"id":"d557d9c9d7fe40a4905b441d67bc79bd","name":"社保","parentId":"fc31941d07174bff84ac57367eaaa6e2","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944182,"modtime":1481944182}],"addtime":1481944145,"modtime":1481944145}],"addtime":1481944063,"modtime":1481944063},{"id":"61f50a2fb89740f9929d62c3f8435a61","name":"职能部","parentId":"70d7d4f9e30541a5a640c29a4cfe6e38","isAuth":true,"childrenIds":["245b47de9b124bb29856d12ce50f3840","badc0c74d11848999a8a6b7c328f965f"],"children":[{"id":"245b47de9b124bb29856d12ce50f3840","name":"后勤","parentId":"61f50a2fb89740f9929d62c3f8435a61","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944122,"modtime":1481944122},{"id":"badc0c74d11848999a8a6b7c328f965f","name":"前台","parentId":"61f50a2fb89740f9929d62c3f8435a61","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944115,"modtime":1481944115}],"addtime":1481944050,"modtime":1481944050},{"id":"84762e69b14b4929ba64375fc997ad51","name":"技术部","parentId":"70d7d4f9e30541a5a640c29a4cfe6e38","isAuth":true,"childrenIds":["c6926f68a224447fbe25a5c04f8428b2","fb8dc62c84c74c00bdb608060f9a02e5"],"children":[{"id":"c6926f68a224447fbe25a5c04f8428b2","name":"研发部","parentId":"84762e69b14b4929ba64375fc997ad51","isAuth":true,"childrenIds":["b5cae02ede9a47f0999d80ab04806fd0","f4381eea73bc446fab98204054c2b445"],"children":[{"id":"b5cae02ede9a47f0999d80ab04806fd0","name":"前端&lt;a&gt;","parentId":"c6926f68a224447fbe25a5c04f8428b2","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944097,"modtime":1481944097},{"id":"f4381eea73bc446fab98204054c2b445","name":"后端","parentId":"c6926f68a224447fbe25a5c04f8428b2","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944105,"modtime":1481944105}],"addtime":1481944072,"modtime":1481944072},{"id":"fb8dc62c84c74c00bdb608060f9a02e5","name":"test","parentId":"84762e69b14b4929ba64375fc997ad51","isAuth":true,"childrenIds":[],"children":[],"addtime":1481944085,"modtime":1481944085}],"addtime":1481944038,"modtime":1481944038}]})
        }

    }
}





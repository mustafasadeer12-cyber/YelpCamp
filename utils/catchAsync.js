module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next); // catches rejected promises !!
    }
}










// module.exports = func => {
//     return(req, res, next) => {
//         func(req, res, next).catch(next);
//     }
// }
export default data =>
    data.map(item => ({
        ...item,
        author: item.author.split(' ')[0] + ' ' + item.author.split(' ')[1][0],
    }));

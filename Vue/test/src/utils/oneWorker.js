// worker.js
// 单worker
// self.onmessage = (e) => {
//   const { csvdata, total, size } = e.data;

//   const step = Math.ceil(total / size);
//   let csvArray = [];
//   csvArray.push(['编号', '用户名', '官网', '报价', '创建日期'].join() + '\n');

//   try {
//     for (let i = 0; i < step; i++) {
//       const data = csvdata.slice(i * size, (i + 1) * size);
//       data.forEach(row => {
//         csvArray.push(Object.values(row).join() + '\n');
//       });
//       // 发送进度更新给主线程
//     //   const process = ((i + 1) / step) * 100;
//     //   self.postMessage({ type: 'progress', process });
//     }

//     // 处理完成后返回结果
//     self.postMessage({ type: 'done', csvArray });
//   } catch (error) {
//     self.postMessage({ type: 'error', error });
//   }
// };


//单woker + 数据处理
self.onmessage = (event) => {
  const { total, size } = event.data;

  const step = Math.ceil(total / size);

  try {
    for (let i = 0; i < step; i++) {
      const data = new Array(size).fill('').map((_, index) => ({
        id: `200820-${i * size + index}`,
        username: '用户' + Math.floor(Math.random() * 1000),
        url: 'http://example.com/' + Math.floor(Math.random() * 1000),
        price: (Math.random() * 100000).toFixed(2),
        createAt: new Date().toISOString(),
      }));

      const csvChunk = data.map(row => Object.values(row).join(',')).join('\n') + '\n';
      const process = ((i + 1) / step) * 100;
      self.postMessage({ type: 'progress', csvChunk, process });
    }

    self.postMessage({ type: 'done' });
  } catch (error) {
    self.postMessage({ type: 'error', error });
  }
};

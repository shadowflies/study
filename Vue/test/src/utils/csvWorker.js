
// worker.js
//多worker
// self.onmessage = (e) => {
//   try {
//     const { csvdata, size } = e.data;

//     // CSV 数据生成
//     const csvArray = csvdata.map((row) => Object.values(row).join() + '\n');

//     // 模拟分片处理（按 size 分块）
//     const chunkedCsv = [];
//     for (let i = 0; i < csvArray.length; i += size) {
//       chunkedCsv.push(...csvArray.slice(i, i + size));
//     }

//     // 返回处理结果
//     self.postMessage({ type: 'done', csvArray: chunkedCsv });
//   } catch (error) {
//     self.postMessage({ type: 'error', error: error.message });
//   }
// };


//多Worker + 数据生成
self.onmessage = (event) => {
  const { start, end, size } = event.data;

  try {
    const step = Math.ceil((end - start) / size); // 分片数量

    for (let i = 0; i < step; i++) {
      const chunkStart = start + i * size;
      const chunkEnd = Math.min(chunkStart + size, end);

      // 生成数据分片
      const data = new Array(chunkEnd - chunkStart).fill('').map((_, index) => ({
        id: `200820-${chunkStart + index}`,
        username: '用户' + Math.floor(Math.random() * 1000),
        url: 'http://example.com/' + Math.floor(Math.random() * 1000),
        price: (Math.random() * 100000).toFixed(2),
        createAt: new Date().toISOString(),
      }));

      const csvChunk = data.map(row => Object.values(row).join(',')).join('\n') + '\n';

      // 通知主线程进度
      self.postMessage({ type: 'progress', csvChunk, progress: 1 });
    }

    self.postMessage({ type: 'done' });
  } catch (error) {
    self.postMessage({ type: 'error', error });
  }
};

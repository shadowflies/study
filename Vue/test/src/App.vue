<template>
  <button @click="exportCsvs" :disabled="pending">导出 CSV 表格</button>
</template>



<!-- <script>
// 普通分片
import Mock from 'mockjs';
import FileSaver from 'file-saver';

export default {
  name: 'App',
  components: {

  },
  data() {
    return {
      csvdata: '',
    }
  },
  created() {
    this.getData(10000 * 100);
  },
  methods: {
    async getData(limit) {
      return new Promise((resolve, reject) => {
        try {
          const Random = Mock.Random;
          // 创建指定个数的随机数据
          const data = new Array(limit).fill('').map((_, index) => {
            return {
              id: `200820-${index}`,
              username: Random.cname(),
              url: Random.url('http'),
              price: Random.float(0, 110000, 0, 2),
              createAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
            };
          });
          this.csvdata = data
          console.log(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    },
    // 导出数据为 CSV 格式
    async exportCsv(total, size) {
      try {
        if (!total) throw "无数据";

        // 分片
        const step = Math.ceil(total / size);

        // CSV 缓存
        let csvArray = [];

        // 表头处理 - 一般表头由外部传入
        csvArray.push(['编号', '用户名', '官网', '报价', '创建日期'].join() + '\n');

        // 通用分片
        for (let i = 0; i < step; i++) {
          await new Promise((resolve, reject) => {
            (async () => {
              try {
                // 创建指定个数的随机数据
                const data = this.csvdata.slice(i, i + size);

                // 格式化为 CSV 字符串
                data.forEach(row => {
                  csvArray.push(Object.values(row).join() + '\n');
                });

                // 统计进度
                // const process = (i / step) * 100;
                // console.log(`进度 ${Math.round(process)}%`);

                // 适当停顿，避免页面无法执行后续
                // await new Promise((_resolve) => {
                //   setTimeout(() => _resolve(true), 50);
                // });

                resolve(true);
              } catch (error) {
                reject(error);
              }
            })();
          });
        }
        const blob = new Blob([String.fromCharCode(0xfeff), ...csvArray], {
          type: "text/plain;charset=utf-8"
        });
        await FileSaver.saveAs(blob, 'file.csv');
        return true;
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 创建模拟数据
    async exportCsvs() {
      try {
        this.pending = true;
        const startTime = performance.now();
        await this.exportCsv(10000 * 100, 2000, (process) => {
          // 进度条更新
          this.csvProcess = process;
        });
        const endTime = performance.now();
        console.log(((endTime - startTime) / 1000).toFixed(2))
      } catch (error) {
        alert(error);
      } finally {
        this.pending = false;
      }
    },
  }
}
</script> -->


<!-- <script>
import Mock from 'mockjs';
import FileSaver from 'file-saver';

export default {
  name: 'App',
  data() {
    return {
      csvdata: '', // 保存生成的 Mock 数据
    };
  },
  created() {
    // 初始化模拟数据
    this.getData(10000 * 100); // 生成 500,000 条数据
  },
  methods: {
    // 创建 Mock 数据
    async getData(limit) {
      const Random = Mock.Random;
      this.csvdata = new Array(limit).fill('').map((_, index) => ({
        id: `200820-${index}`,
        username: Random.cname(),
        url: Random.url('http'),
        price: Random.float(0, 110000, 0, 2),
        createAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      }));
    },

    // 导出 CSV 文件
    async exportCsv(total, size, concurrency = 5) {
      if (!total) throw new Error('无数据');

      const step = Math.ceil(total / size); // 分片总数
      const csvArray = [];
      csvArray.push(['编号', '用户名', '官网', '报价', '创建日期'].join(',') + '\n'); // 添加表头

      const generateCsvChunk = (start, end) => {
        // 处理当前分片数据
        const data = this.csvdata.slice(start, end);
        return data.map((row) => Object.values(row).join(',')).join('\n') + '\n';
      };

      let currentBatch = 0;

      while (currentBatch < step) {
        // 当前并发批次的任务集合
        const tasks = [];

        for (
          let i = 0;
          i < concurrency && currentBatch < step;
          i++, currentBatch++
        ) {
          const start = currentBatch * size;
          const end = Math.min(start + size, total);
          tasks.push(Promise.resolve(generateCsvChunk(start, end)));
        }

        // 等待当前批次的所有任务完成
        const results = await Promise.all(tasks);

        // 将批次结果追加到 csvArray
        csvArray.push(...results);

        // 打印进度信息
        // console.log(
        //   `进度: ${Math.min(
        //     ((currentBatch / step) * 100).toFixed(2),
        //     100
        //   )}%`
        // );
      }

      // 创建 Blob 并保存为 CSV 文件
      const blob = new Blob([String.fromCharCode(0xfeff), ...csvArray], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blob, 'file.csv');
    },

    // 按钮触发导出
    async exportCsvs() {
      try {
        console.log('导出开始...');
        const startTime = performance.now();

        // 导出 CSV 文件
        await this.exportCsv(10000 * 100, 2000, 5);

        const endTime = performance.now();
        console.log(`导出完成，耗时: ${((endTime - startTime) / 1000).toFixed(2)} 秒`);
      } catch (error) {
        console.error('导出失败:', error);
      }
    },
  },
};
</script> -->


<!-- <script>
//单worker
import Mock from 'mockjs';
import FileSaver from 'file-saver';

export default {
  name: 'App',
  components: {

  },
  data() {
    return {
      csvdata: '',
    }
  },
  created() {
    this.getData(5000 * 100);
  },
  methods: {
    async getData(limit) {
      return new Promise((resolve, reject) => {
        try {
          const Random = Mock.Random;
          // 创建指定个数的随机数据
          const data = new Array(limit).fill('').map((_, index) => {
            return {
              id: `200820-${index}`,
              username: Random.cname(),
              url: Random.url('http'),
              price: Random.float(0, 110000, 0, 2),
              createAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
            };
          });
          this.csvdata = data
          console.log(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    },
    // 导出数据为 CSV 格式
    async exportCsv(csvdata, total, size) {
      try {
        if (!total) throw "无数据";

        return new Promise((resolve, reject) => {
          const worker = new Worker(new URL('./utils/oneWorker.js', import.meta.url));

          // 监听 Worker 消息
          worker.onmessage = (e) => {
            const { type, csvArray, error } = e.data;
            // if (type === 'progress') {
            //   console.log(`进度 ${Math.round(process)}%`);
            // } else
            if (type === 'done') {
              const blob = new Blob([String.fromCharCode(0xfeff), ...csvArray], {
                type: "text/plain;charset=utf-8"
              });
              FileSaver.saveAs(blob, 'file.csv');
              resolve(true);
              worker.terminate();
            } else if (type === 'error') {
              reject(error);
              worker.terminate();
            }
          };

          // 发送数据到 Worker
          worker.postMessage({ csvdata, total, size });
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 创建模拟数据
    async exportCsvs() {
      try {
        this.pending = true;


        // 深拷贝数据以移除 Proxy 特性
        const csvdata = JSON.parse(JSON.stringify(this.csvdata));

        // 开始计时
        const startTime = performance.now();

        // 调用导出方法并传递拷贝后的数据
        await this.exportCsv(csvdata, 5000 * 100, 2000);

        const endTime = performance.now();
        console.log(((endTime - startTime) / 1000).toFixed(2));
      } catch (error) {
        alert(error);
      } finally {
        this.pending = false;
      }
    },
  }
}
</script> -->


<!-- <script>
//0.4s
import FileSaver from 'file-saver';

// 导入 Web Worker 脚本
// import Worker from './utils/csvWorker.js';

export default {
  data() {
    return {
      csvProcess: 0,  // 导出进度
      pending: false, // 控制按钮的加载状态
      csvArray: []    // 存储生成的 CSV 数据
    };
  },
  methods: {
    // 创建 Web Worker 实例
    createWorker() {
      const workerCode = `
        self.onmessage = function(event) {
          const { size } = event.data;
          const Random = {
            cname: () => '随机用户' + Math.floor(Math.random() * 1000),
            url: () => 'http://example.com/' + Math.floor(Math.random() * 1000),
            float: () => (Math.random() * 110000).toFixed(2),
            datetime: () => new Date().toISOString().slice(0, 19).replace('T', ' ')
          };

          // 生成模拟数据
          const data = new Array(size).fill('').map((_, index) => {
            return {
              id: \`200820-\${index}\`,
              username: Random.cname(),
              url: Random.url(),
              price: Random.float(),
              createAt: Random.datetime()
            };
          });

          // 转换数据为 CSV 格式
          const csvChunk = data.map(row => Object.values(row).join(',') + '\\n').join('');
          
          // 发送 CSV 分片回主线程
          self.postMessage({ csvChunk });
        };
      `;

      // 将代码字符串转为 Blob URL
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      return new Worker(URL.createObjectURL(blob));
    },

    // 使用 Web Worker 进行 CSV 导出
    async exportCsvWithWorker(total, size) {
      if (!total) throw "无数据";

      // 重置 CSV 数据和进度
      this.csvArray = [];
      this.csvArray.push(['编号', '用户名', '官网', '报价', '创建日期'].join(',') + '\n'); // 表头
      this.csvProcess = 0;

      const worker = this.createWorker();  // 创建 Web Worker 实例
      const step = Math.ceil(total / size); // 分片数量
      let completedSteps = 0;

      const startTime = performance.now(); // 记录开始时间

      return new Promise((resolve, reject) => {
        // 监听 Web Worker 消息
        worker.onmessage = (event) => {
          const { csvChunk } = event.data;

          // 保存 CSV 数据分片
          this.csvArray.push(csvChunk);
          completedSteps += 1;

          // 更新导出进度
          this.csvProcess = Math.round((completedSteps / step) * 100);

          // 检查是否所有分片都已完成
          if (completedSteps === step) {
            const endTime = performance.now(); // 记录结束时间
            const totalTime = ((endTime - startTime) / 1000).toFixed(2); // 总耗时（秒）
            console.log(`任务完成，共耗时 ${totalTime} 秒`);

            this.downloadCsv();
            worker.terminate(); // 终止 Web Worker
            resolve();
          }
        };

        // 监听 Web Worker 错误
        worker.onerror = (error) => {
          console.error('Worker error:', error);
          alert('导出失败，请稍后重试。');
          worker.terminate();
          reject(error);
        };

        // 将任务分片传递给 Web Worker
        for (let i = 0; i < step; i++) {
          worker.postMessage({ size });
        }
      });
    },

    // 下载 CSV 文件
    downloadCsv() {
      const blob = new Blob([String.fromCharCode(0xfeff), ...this.csvArray], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, 'file.csv');
    },

    // 创建模拟数据并导出 CSV
    async exportCsvs() {
      try {
        this.pending = true;
        await this.exportCsvWithWorker(2000 * 100, 2000); // 生成20万条数据，每次处理2000条
      } catch (error) {
        console.error('导出过程出错:', error);
      } finally {
        this.pending = false;
      }
    },
  }
};

</script> -->


<!-- <script>
//多worker
import Mock from 'mockjs';
import FileSaver from 'file-saver';

export default {
  name: 'App',
  data() {
    return {
      csvdata: '',
    };
  },
  created() {
    this.getData(5000 * 100);
  },
  methods: {
    // 模拟数据生成
    async getData(limit) {
      const Random = Mock.Random;
      const data = Array.from({ length: limit }, (_, index) => ({
        id: `200820-${index}`,
        username: Random.cname(),
        url: Random.url('http'),
        price: Random.float(0, 110000, 0, 2),
        createAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      }));
      this.csvdata = data;
      console.log(data);
    },

    // 多 Worker 导出 CSV
    async exportCsv(csvdata, total, size) {
      try {
        if (!total) throw '无数据';

        const MAX_WORKERS = Math.min(navigator.hardwareConcurrency || 4, 8); // 最大 Worker 数量
        const taskSize = Math.ceil(total / MAX_WORKERS); // 每个 Worker 的任务量
        const tasks = Array.from({ length: MAX_WORKERS }, (_, index) => ({
          start: index * taskSize,
          end: Math.min((index + 1) * taskSize, total),
        }));

        const results = [];
        const workerPromises = tasks.map((task) =>
          new Promise((resolve, reject) => {
            const worker = new Worker(new URL('./utils/csvWorker.js', import.meta.url));

            // 监听 Worker 消息
            worker.onmessage = (e) => {
              const { type, csvArray, error } = e.data;
              if (type === 'done') {
                results.push(...csvArray);
                worker.terminate();
                resolve();
              } else if (type === 'error') {
                worker.terminate();
                reject(error);
              }
            };

            // 发送任务数据到 Worker
            worker.postMessage({
              csvdata: csvdata.slice(task.start, task.end),
              size,
            });
          })
        );

        // 等待所有 Worker 完成
        await Promise.all(workerPromises);

        // 合并结果并保存
        const blob = new Blob([String.fromCharCode(0xfeff), ...results], {
          type: 'text/plain;charset=utf-8',
        });
        FileSaver.saveAs(blob, 'file.csv');
        console.log('导出完成');
      } catch (error) {
        console.error('任务失败:', error);
      }
    },

    // 调用导出方法
    async exportCsvs() {
      try {
        this.pending = true;
        const csvdata = JSON.parse(JSON.stringify(this.csvdata)); // 深拷贝以移除 Proxy 特性
        const startTime = performance.now();


        // 调用多线程导出
        await this.exportCsv(csvdata, 5000 * 100, 2000);

        const endTime = performance.now();
        console.log(`耗时: ${(endTime - startTime) / 1000}s`);
      } catch (error) {
        alert(error);
      } finally {
        this.pending = false;
      }
    },
  },
};
</script> -->


<!-- <script>
//单worker + 数据生成
import FileSaver from 'file-saver';

export default {
  data() {
    return {
      csvProcess: 0, // 导出进度
      pending: false, // 按钮加载状态
      csvArray: [], // 存储 CSV 数据分片
    };
  },
  methods: {
    async exportCsvWithWorker(total, size) {
      if (!total) throw new Error('无数据');

      this.csvArray = [];
      this.csvArray.push(['编号', '用户名', '官网', '报价', '创建日期'].join(',') + '\n'); // 表头
      this.csvProcess = 0;

      const worker = new Worker(new URL('./utils/oneWorker.js', import.meta.url));
      const startTime = performance.now();

      return new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          const { type, csvChunk, process, error } = e.data;

          if (type === 'progress') {
            this.csvArray.push(csvChunk);
            this.csvProcess = Math.round(process);
          } else if (type === 'done') {
            const endTime = performance.now();
            console.log(`任务完成，共耗时 ${((endTime - startTime) / 1000).toFixed(2)} 秒`);

            this.downloadCsv();
            worker.terminate();
            resolve();
          } else if (type === 'error') {
            console.error('Worker error:', error);
            worker.terminate();
            reject(error);
          }
        };

        worker.onerror = (error) => {
          console.error('Worker error:', error);
          worker.terminate();
          reject(error);
        };

        worker.postMessage({ total, size });
      });
    },

    downloadCsv() {
      const blob = new Blob([String.fromCharCode(0xfeff), ...this.csvArray], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blob, 'file.csv');
    },

    async exportCsvs() {
      try {
        this.pending = true;
        await this.exportCsvWithWorker(10000 * 100, 2000);
      } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败，请稍后重试。');
      } finally {
        this.pending = false;
      }
    },
  },
};
</script> -->


<script>
import FileSaver from 'file-saver';

export default {
  data() {
    return {
      csvProcess: 0, // 导出进度
      pending: false, // 按钮加载状态
      csvArray: [], // 存储 CSV 数据分片
    };
  },
  methods: {
    // 创建 Worker 实例
    createWorker() {
      return new Worker(new URL('./utils/csvWorker.js', import.meta.url));
    },

    // 使用多 Worker 导出 CSV
    async exportCsvWithMultiWorkers(total, size, workerCount = 4) {
      if (!total) throw new Error('无数据');

      this.csvArray = [];
      this.csvArray.push(['编号', '用户名', '官网', '报价', '创建日期'].join(',') + '\n'); // 表头
      this.csvProcess = 0;

      const step = Math.ceil(total / size);
      const tasksPerWorker = Math.ceil(step / workerCount); // 每个 Worker 的任务数量
      let completedSteps = 0;

      const startTime = performance.now();

      return new Promise((resolve, reject) => {
        const workers = Array.from({ length: workerCount }, () => this.createWorker());
        const promises = workers.map((worker, workerIndex) => {
          return new Promise((resolveWorker, rejectWorker) => {
            const start = workerIndex * tasksPerWorker * size; // 起始位置
            const end = Math.min((workerIndex + 1) * tasksPerWorker * size, total); // 结束位置

            worker.onmessage = (e) => {
              const { type, csvChunk, progress, error } = e.data;

              if (type === 'progress') {
                this.csvArray.push(csvChunk);
                completedSteps += progress;
                this.csvProcess = Math.round((completedSteps / step) * 100);
              } else if (type === 'done') {
                worker.terminate();
                resolveWorker();
              } else if (type === 'error') {
                worker.terminate();
                rejectWorker(error);
              }
            };

            worker.onerror = (error) => {
              console.error('Worker error:', error);
              worker.terminate();
              rejectWorker(error);
            };

            // 分发任务
            worker.postMessage({ start, end, size });
          });
        });

        Promise.all(promises)
          .then(() => {
            const endTime = performance.now();
            console.log(`任务完成，共耗时 ${((endTime - startTime) / 1000).toFixed(2)} 秒`);

            this.downloadCsv();
            resolve();
          })
          .catch((error) => {
            console.error('导出失败:', error);
            alert('导出失败，请稍后重试。');
            reject(error);
          });
      });
    },

    downloadCsv() {
      const blob = new Blob([String.fromCharCode(0xfeff), ...this.csvArray], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blob, 'file.csv');
    },

    async exportCsvs() {
      try {
        this.pending = true;
        const total = 10000 * 100; // 总数据量
        const size = 2000; // 每批次数据量
        const workerCount = 4; // Worker 数量
        await this.exportCsvWithMultiWorkers(total, size, workerCount);
      } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败，请稍后重试。');
      } finally {
        this.pending = false;
      }
    },
  },
};
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<!-- <script>
//promise.all
import Mock from 'mockjs';
import FileSaver from 'file-saver';

export default {
  name: 'App',
  components: {

  },
  data() {
    return {
      csvdata: '',
    }
  },
  created() {
    this.getData(5000 * 100);
  },
  methods: {
    async getData(limit) {
      return new Promise((resolve, reject) => {
        try {
          const Random = Mock.Random;
          // 创建指定个数的随机数据
          const data = new Array(limit).fill('').map((_, index) => {
            return {
              id: `200820-${index}`,
              username: Random.cname(),
              url: Random.url('http'),
              price: Random.float(0, 110000, 0, 2),
              createAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
            };
          });
          this.csvdata = data
          console.log(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    },
    // 导出数据为 CSV 格式
    async exportCsv(total, size, concurrency = 5) {
      try {
        if (!total) throw "无数据";

        // 分片总数
        const step = Math.ceil(total / size);

        // CSV 缓存
        let csvArray = [];
        csvArray.push(['编号', '用户名', '官网', '报价', '创建日期'].join() + '\n'); // 表头

        // 并发控制
        let currentBatch = 0;
        while (currentBatch < step) {
          // 创建一批并发任务
          const tasks = [];
          for (let i = 0; i < concurrency && currentBatch < step; i++, currentBatch++) {
            tasks.push(
              (async () => {
                const temp = currentBatch * concurrency + i
                const data = this.csvdata.slice(temp, temp + size);
                const csv = data.map(row => Object.values(row).join() + '\n');
                csvArray.push(...csv);

                // 更新进度
                // const process = (index / step) * 100;
                // console.log(`进度 ${Math.round(process)}%`);
              })(currentBatch)
            );
          }

          // 等待当前并发任务完成
          await Promise.all(tasks);

          // 适当延迟，避免页面卡顿
          // await new Promise(resolve => setTimeout(resolve, 50));
        }

        // 创建 Blob 并保存为 CSV 文件
        const blob = new Blob([String.fromCharCode(0xfeff), ...csvArray], {
          type: "text/plain;charset=utf-8"
        });
        await FileSaver.saveAs(blob, 'file.csv');
        return true;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 创建模拟数据
    async exportCsvs() {
      try {
        this.pending = true;
        const startTime = performance.now();
        await this.exportCsv(5000 * 100, 2000, 5, (process) => {
          // 进度条更新
          this.csvProcess = process;
        });
        const endTime = performance.now();
        console.log(((endTime - startTime) / 1000).toFixed(2))
      } catch (error) {
        alert(error);
      } finally {
        this.pending = false;
      }
    },
  }
}
</script> -->

<!-- <script>
import Mock from 'mockjs';
import FileSaver from 'file-saver';

export default {
  name: 'App',
  components: {

  },
  data() {
    return {
      csvdata: '',
    }
  },
  created() {
    this.getData(2000 * 100);
  },
  methods: {
    async getData(limit) {
      return new Promise((resolve, reject) => {
        try {
          const Random = Mock.Random;
          // 创建指定个数的随机数据
          const data = new Array(limit).fill('').map((_, index) => {
            return {
              id: `200820-${index}`,
              username: Random.cname(),
              url: Random.url('http'),
              price: Random.float(0, 110000, 0, 2),
              createAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
            };
          });
          this.csvdata = data
          console.log(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    },
    // 导出数据为 CSV 格式
    async exportCsv(csvdata, total, size) {
      try {
        if (!total) throw "无数据";

        return new Promise((resolve, reject) => {
          const worker = new Worker(new URL('./utils/csvWorker.js', import.meta.url));

          // 监听 Worker 消息
          worker.onmessage = (e) => {
            const { type, process, csvArray, error } = e.data;
            if (type === 'progress') {
              console.log(`进度 ${Math.round(process)}%`);
            } else if (type === 'done') {
              const blob = new Blob([String.fromCharCode(0xfeff), ...csvArray], {
                type: "text/plain;charset=utf-8"
              });
              FileSaver.saveAs(blob, 'file.csv');
              resolve(true);
              worker.terminate();
            } else if (type === 'error') {
              reject(error);
              worker.terminate();
            }
          };

          // 发送数据到 Worker
          worker.postMessage({ csvdata, total, size });
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 创建模拟数据
    async exportCsvs() {
      try {
        this.pending = true;

        // 深拷贝数据以移除 Proxy 特性
        const csvdata = JSON.parse(JSON.stringify(this.csvdata));

        // 开始计时
        const startTime = performance.now();

        // 调用导出方法并传递拷贝后的数据
        await this.exportCsv(csvdata, 2000 * 100, 2000);

        const endTime = performance.now();
        console.log(((endTime - startTime) / 1000).toFixed(2));
      } catch (error) {
        alert(error);
      } finally {
        this.pending = false;
      }
    },

  }
}
</script> -->

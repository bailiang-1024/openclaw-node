// 示例：使用新添加的skills方法
const { OpenClawClient } = require('./dist/index.js');

async function main() {
  const client = new OpenClawClient({
    url: 'ws://localhost:18789',
    autoReconnect: false,
  });

  try {
    await client.connect();
    console.log('Connected to OpenClaw Gateway');

    // 检查skills方法是否可用
    if (client.hasMethod('skills.status')) {
      console.log('skills.status method is available');
      
      // 获取skill状态报告
      const status = await client.skills.status();
      console.log('Skill Status Report:', JSON.stringify(status, null, 2));
    } else {
      console.log('skills.status method is not available on this Gateway');
    }

    if (client.hasMethod('skills.list')) {
      console.log('skills.list method is available');
      
      // 获取skill列表
      const list = await client.skills.list();
      console.log('Skill List:', JSON.stringify(list, null, 2));
    } else {
      console.log('skills.list method is not available on this Gateway');
    }

    await client.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 如果直接运行此文件，则执行main函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
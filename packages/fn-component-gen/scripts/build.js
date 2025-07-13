// 使用 rollup + rollup-plugin-esbuild + rollup-plugin-dts 替换 esbuild 脚本
const { execSync } = require('child_process')

try {
  // 构建 JS
  execSync('rollup -c', { stdio: 'inherit' })
  console.log('Rollup JS 构建完成!')
  // 构建类型声明
  execSync('rollup -c --configPlugin dts', { stdio: 'inherit' })
  console.log('类型声明文件生成完成!')
  console.log('Build completed!')
} catch (e) {
  console.error('构建失败:', e)
  process.exit(1)
}

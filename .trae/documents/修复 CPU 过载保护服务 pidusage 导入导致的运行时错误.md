# 修复单元测试失败问题

从用户提供的错误日志来看，测试失败的原因是状态在不同的测试用例之间被保留了，导致预期值和实际值不符。

具体分析：
1.  **第一个失败 (should update overloadTimes and apply EMA...)**:
    -   `Expected: 800`, `Received: 0`
    -   这意味着 `service['currentCpuPercentage']` 仍然是 0，说明 `service.startCpuMonitor()` 实际上可能抛出了异常或者没有正确执行。结合上文修复的逻辑，很可能是因为之前的 mock 方式 (`(pidusage.default as ...).mockResolvedValueOnce`) 没有生效，或者 `pidusage` 实际上抛出了错误导致逻辑进入了 `catch` 块，从而 `currentCpuPercentage` 没有被赋值。
    -   **原因**：在之前的修复中，我将 `pidusage` 的 Mock 改为了 `jest.mock('pidusage', () => ({ default: jest.fn() }))`，但在测试用例中调用时使用的是 `(pidusage.default as ...)`，而 `require('pidusage')` 导出的可能不是预期的结构。实际上，由于使用了 `import pidusage = require('pidusage')`，我们应该直接 Mock `pidusage` 本身。

2.  **第二个失败 (should trigger overload on memory usage high)**:
    -   `Expected: 3`, `Received: 0`
    -   `overloadTimes` 为 0，说明也没有累加。这进一步证实了 `startCpuMonitor` 的核心逻辑可能因为 Mock 问题根本没跑通。

3.  **第三个失败 (should decrement overloadTimes...)**:
    -   `Expected: 150`, `Received: 200`
    -   这可能是因为前面的测试失败导致状态错乱，或者 Mock 值没有被正确应用。

**核心问题**: `pidusage` 的 Mock 方式与 CommonJS 的 `require` 导入方式配合有问题。

## 修复计划

1.  **调整 `pidusage` Mock 策略**:
    -   不再尝试复杂的 `default` 属性 Mock。
    -   直接使用 `jest.mock('pidusage')` 并通过 `pidusage` 变量本身来控制 Mock 行为。
    -   因为代码里是 `import pidusage = require('pidusage')`，这意味着 `pidusage` 本身就是一个函数。

2.  **重置服务状态**:
    -   在 `beforeEach` 中重置 `service` 的关键状态属性（`overloadTimes`, `currentCpuPercentage`, `cpuMonitorFailureCount` 等），确保每个测试用例都是从干净的状态开始。

3.  **修正测试用例中的 Mock 调用**:
    -   将 `(pidusage.default as ...)` 改回 `(pidusage as unknown as jest.Mock)`。

## 修改文件
- `src/modules/cpu-overload-protection/cpu-overload-protection.service.spec.ts`

## 验证计划
- 运行 `npx jest src/modules/cpu-overload-protection/cpu-overload-protection.service.spec.ts` 确保所有测试通过。

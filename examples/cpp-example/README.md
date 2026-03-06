# C++ Example

This example demonstrates SieveAi's ability to detect C++ specific issues including:

- **Performance Issues**: Unnecessary copying, inefficient loops
- **Const Correctness**: Missing const qualifiers on parameters and methods
- **Modern C++ Patterns**: Range-based loops, RAII
- **Security Issues**: Hardcoded secrets
- **Code Style**: Inline function recommendations

## Files

- `example.cpp` - Sample C++ code with various issues
- `.sieveai.config.json` - Configuration optimized for C++ analysis

## Usage

```bash
# From the SieveAi root directory
cd examples/cpp-example

# Run analysis
npx tsx ../../src/cli/index.ts check

# Or using the npm script
npm run check
```

## Expected Output

SieveAi will detect multiple issues including:

1. **Performance Issues**:
   - Function parameters passed by value instead of const reference
   - Inefficient loop patterns

2. **Const Correctness**:
   - Methods that should be const
   - Missing const on parameters

3. **Security Issues**:
   - Hardcoded secrets in source code

4. **Style Improvements**:
   - Range-based loop recommendations
   - Inline function suggestions

## Fixed Version

Here's how the code should look after applying SieveAi's suggestions:

```cpp
#include <iostream>
#include <vector>
#include <string>

class DataProcessor {
public:
    // ✅ Const reference for performance
    void processData(const std::vector<int>& data) {
        // ✅ Use empty() instead of size comparison
        if (!data.empty()) {
            // ✅ Range-based loop
            for (const auto& item : data) {
                process(item);
            }
        }
    }

    // ✅ Const method
    int getCount() const {
        return count;
    }

    // ✅ Inline function
    inline int getValue() const {
        return value;
    }

private:
    int count = 0;
    int value = 42;
    // ✅ Secret moved to environment variable
    // std::string api_key = std::getenv("API_KEY");
    
    void process(int item) const {
        const std::string temp = "processing: " + std::to_string(item);
        std::cout << temp << std::endl;
        count++;
    }
};

// ✅ Const reference parameter
void printVector(const std::vector<std::string>& items) {
    // ✅ Range-based loop with const reference
    for (const auto& item : items) {
        std::cout << item << std::endl;
    }
}

int main() {
    DataProcessor processor;
    const std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    processor.processData(numbers);  // ✅ No unnecessary copy
    
    const std::vector<std::string> strings = {"hello", "world"};
    printVector(strings);  // ✅ No unnecessary copy
    
    return 0;
}
```
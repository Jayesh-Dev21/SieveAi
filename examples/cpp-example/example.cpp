// Example C++ code with common issues for SieveAi to detect

#include <iostream>
#include <vector>
#include <string>

class DataProcessor {
public:
    // ❌ Parameter should be const reference for performance
    void processData(std::vector<int> data) {
        // ❌ Should use !data.empty() instead of size comparison
        if (data.size() > 0) {
            for (int i = 0; i < data.size(); i++) {  // ❌ Use size_t or range-based loop
                process(data[i]);
            }
        }
    }

    // ❌ Function should be const since it doesn't modify state
    int getCount() {
        return count;
    }

    // ❌ Missing inline for small, frequently-called function
    int getValue() const {
        return value;
    }

private:
    int count = 0;
    int value = 42;
    std::string api_key = "secret-123-key";  // ❌ Hardcoded secret
    
    void process(int item) {
        // ❌ Missing const
        std::string temp = "processing: " + std::to_string(item);
        std::cout << temp << std::endl;
        count++;
    }
};

// ❌ Function parameter should be const reference
void printVector(std::vector<std::string> items) {
    // ❌ Use range-based for loop for better readability
    for (int i = 0; i < items.size(); i++) {
        std::cout << items[i] << std::endl;
    }
}

int main() {
    DataProcessor processor;
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    processor.processData(numbers);  // ❌ Unnecessary copy
    
    std::vector<std::string> strings = {"hello", "world"};
    printVector(strings);  // ❌ Another unnecessary copy
    
    return 0;
}

/* 
Expected SieveAi Findings:

● HIGH | PERFORMANCE | example.cpp:8
  Function parameter should be const reference
  Reason: Passing large objects by value causes unnecessary copying
  Fix: Change to `const std::vector<int>& data`

● MEDIUM | STYLE | example.cpp:10  
  Use container.empty() instead of size() comparison
  Reason: empty() is more explicit and potentially faster
  Fix: Replace `data.size() > 0` with `!data.empty()`

● MEDIUM | PERFORMANCE | example.cpp:11
  Use size_t for loop variable or range-based loop
  Reason: Avoids signed/unsigned comparison warnings
  Fix: Use `for (size_t i = 0; i < data.size(); ++i)` or `for (auto item : data)`

● MEDIUM | STYLE | example.cpp:17
  Function should be const
  Reason: Function doesn't modify object state
  Fix: Add const qualifier: `int getCount() const`

● LOW | PERFORMANCE | example.cpp:22
  Small function should be inline
  Reason: Eliminates function call overhead
  Fix: Add inline keyword or define in header

● CRITICAL | SECURITY | example.cpp:29
  Hardcoded secret detected
  Reason: Secrets in source code pose security risks
  Fix: Move to environment variables or secure config

● HIGH | PERFORMANCE | example.cpp:38
  Function parameter should be const reference
  Fix: Change to `const std::vector<std::string>& items`

● MEDIUM | STYLE | example.cpp:40
  Use range-based for loop
  Reason: More readable and less error-prone
  Fix: `for (const auto& item : items) { std::cout << item << std::endl; }`
*/
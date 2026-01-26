"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api";

// Types based on interface_fe_v2.md
interface TestResult {
  step: string;
  status: "pending" | "running" | "success" | "error" | "skipped";
  response?: any;
  error?: string;
  duration?: number;
}

interface TestCredentials {
  username: string;
  password: string;
  email: string;
}

const API_BASE = "/api/v1";

export default function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [credentials, setCredentials] = useState<TestCredentials>({
    username: `test_user_${Date.now()}`,
    password: "testpass123",
    email: `test_${Date.now()}@example.com`,
  });
  const [token, setToken] = useState<string | null>(null);
  const [createdTodoId, setCreatedTodoId] = useState<string | null>(null);
  const [createdSubtaskId, setCreatedSubtaskId] = useState<string | null>(null);
  const [createdContextId, setCreatedContextId] = useState<string | null>(null);

  const updateResult = (index: number, update: Partial<TestResult>) => {
    setResults((prev) => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], ...update };
      return newResults;
    });
  };

  const runTest = async (
    index: number,
    name: string,
    testFn: () => Promise<any>
  ): Promise<any> => {
    updateResult(index, { status: "running" });
    const start = Date.now();
    try {
      const response = await testFn();
      updateResult(index, {
        status: "success",
        response,
        duration: Date.now() - start,
      });
      return response;
    } catch (err: any) {
      updateResult(index, {
        status: "error",
        error: err?.message || JSON.stringify(err),
        duration: Date.now() - start,
      });
      throw err;
    }
  };

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setToken(null);
    setCreatedTodoId(null);
    setCreatedSubtaskId(null);
    setCreatedContextId(null);

    // Initialize test steps
    const steps: TestResult[] = [
      { step: "1. Register User", status: "pending" },
      { step: "2. Login", status: "pending" },
      { step: "3. Get Current User", status: "pending" },
      { step: "4. Create Context", status: "pending" },
      { step: "5. Get Contexts", status: "pending" },
      { step: "6. Create Todo", status: "pending" },
      { step: "7. Get Todos", status: "pending" },
      { step: "8. Get Todo by ID", status: "pending" },
      { step: "9. Update Todo", status: "pending" },
      { step: "10. Create Subtask", status: "pending" },
      { step: "11. Get Subtasks", status: "pending" },
      { step: "12. Update Subtask", status: "pending" },
      { step: "13. Delete Subtask", status: "pending" },
      { step: "14. AI Extract (if available)", status: "pending" },
      { step: "15. Delete Todo", status: "pending" },
      { step: "16. Delete Context", status: "pending" },
    ];
    setResults(steps);

    let currentToken: string | null = null;
    let todoId: string | null = null;
    let subtaskId: string | null = null;
    let contextId: string | null = null;

    try {
      // 1. Register
      try {
        const registerRes = await runTest(0, "Register", () =>
          apiClient.post(`${API_BASE}/auth/register`, {
            username: credentials.username,
            email: credentials.email,
            password: credentials.password,
            full_name: "Test User",
            timezone: "Asia/Ho_Chi_Minh",
          })
        );
      } catch (e: any) {
        // User might already exist, continue to login
        if (!e?.message?.includes("already")) throw e;
      }

      // 2. Login
      const loginRes = await runTest(1, "Login", () =>
        apiClient.post(`${API_BASE}/auth/login`, {
          username: credentials.username,
          password: credentials.password,
        })
      );
      currentToken = loginRes.data?.access_token || loginRes.access_token;
      if (currentToken) {
        apiClient.setAuthToken(currentToken);
        setToken(currentToken);
      }

      // 3. Get Current User
      await runTest(2, "Get User", () =>
        apiClient.get(`${API_BASE}/users/me`)
      );

      // 4. Create Context
      const contextRes = await runTest(3, "Create Context", () =>
        apiClient.post(`${API_BASE}/contexts`, {
          name: `Test Context ${Date.now()}`,
          description: "Test context for API testing",
          color: "#FF5733",
          icon: "folder",
        })
      );
      contextId = contextRes.data?.context_id;
      setCreatedContextId(contextId);

      // 5. Get Contexts
      await runTest(4, "Get Contexts", () =>
        apiClient.get(`${API_BASE}/contexts`)
      );

      // 6. Create Todo
      const todoRes = await runTest(5, "Create Todo", () =>
        apiClient.post(`${API_BASE}/todos`, {
          title: `Test Todo ${Date.now()}`,
          description: "This is a test todo created by API test page",
          status: "todo",
          priority: "high",
          due_date: new Date(Date.now() + 86400000).toISOString(),
          context_id: contextId,
          tags: ["test", "api"],
          eisenhower: "urgent_important",
        })
      );
      todoId = todoRes.data?.todo_id;
      setCreatedTodoId(todoId);

      // 7. Get Todos
      await runTest(6, "Get Todos", () =>
        apiClient.get(`${API_BASE}/todos?limit=10`)
      );

      // 8. Get Todo by ID
      if (todoId) {
        await runTest(7, "Get Todo", () =>
          apiClient.get(`${API_BASE}/todos/${todoId}`)
        );
      } else {
        updateResult(7, { status: "skipped", error: "No todo ID" });
      }

      // 9. Update Todo
      if (todoId) {
        await runTest(8, "Update Todo", () =>
          apiClient.put(`${API_BASE}/todos/${todoId}`, {
            title: "Updated Test Todo",
            status: "in_progress",
            priority: "urgent",
          })
        );
      } else {
        updateResult(8, { status: "skipped", error: "No todo ID" });
      }

      // 10. Create Subtask
      if (todoId) {
        const subtaskRes = await runTest(9, "Create Subtask", () =>
          apiClient.post(`${API_BASE}/todos/${todoId}/subtasks`, {
            title: "Test Subtask",
            status: "todo",
            order: 0,
          })
        );
        subtaskId = subtaskRes.data?.subtask_id;
        setCreatedSubtaskId(subtaskId);
      } else {
        updateResult(9, { status: "skipped", error: "No todo ID" });
      }

      // 11. Get Subtasks
      if (todoId) {
        await runTest(10, "Get Subtasks", () =>
          apiClient.get(`${API_BASE}/todos/${todoId}/subtasks`)
        );
      } else {
        updateResult(10, { status: "skipped", error: "No todo ID" });
      }

      // 12. Update Subtask
      if (todoId && subtaskId) {
        await runTest(11, "Update Subtask", () =>
          apiClient.put(`${API_BASE}/todos/${todoId}/subtasks/${subtaskId}`, {
            title: "Updated Subtask",
            status: "completed",
          })
        );
      } else {
        updateResult(11, { status: "skipped", error: "No subtask ID" });
      }

      // 13. Delete Subtask
      if (todoId && subtaskId) {
        await runTest(12, "Delete Subtask", () =>
          apiClient.delete(`${API_BASE}/todos/${todoId}/subtasks/${subtaskId}`)
        );
      } else {
        updateResult(12, { status: "skipped", error: "No subtask ID" });
      }

      // 14. AI Extract
      try {
        await runTest(13, "AI Extract", () =>
          apiClient.post(
            `${API_BASE}/ai/extract`,
            new URLSearchParams({
              text: "Họp team lúc 3h chiều mai, deadline báo cáo thứ 6",
              auto_save: "false",
              source_type: "chat",
            }),
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          )
        );
      } catch {
        updateResult(13, { status: "skipped", error: "AI service not available" });
      }

      // 15. Delete Todo
      if (todoId) {
        await runTest(14, "Delete Todo", () =>
          apiClient.delete(`${API_BASE}/todos/${todoId}`)
        );
      } else {
        updateResult(14, { status: "skipped", error: "No todo ID" });
      }

      // 16. Delete Context
      if (contextId) {
        await runTest(15, "Delete Context", () =>
          apiClient.delete(`${API_BASE}/contexts/${contextId}`)
        );
      } else {
        updateResult(15, { status: "skipped", error: "No context ID" });
      }
    } catch (err) {
      console.error("Test flow error:", err);
    } finally {
      setIsRunning(false);
    }
  }, [credentials]);

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success": return "text-green-400";
      case "error": return "text-red-400";
      case "running": return "text-yellow-400";
      case "skipped": return "text-gray-400";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success": return "✓";
      case "error": return "✗";
      case "running": return "⟳";
      case "skipped": return "○";
      default: return "•";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">SpiderX API Test Flow</h1>
        <p className="text-gray-400 mb-6">
          Test toàn bộ flow tạo todos theo interface_fe_v2.md
        </p>

        {/* Credentials */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Test Credentials</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full bg-gray-700 rounded px-3 py-2 text-sm"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full bg-gray-700 rounded px-3 py-2 text-sm"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-gray-700 rounded px-3 py-2 text-sm"
                disabled={isRunning}
              />
            </div>
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`w-full py-3 rounded-lg font-semibold mb-6 transition ${
            isRunning
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isRunning ? "Running Tests..." : "Run All Tests"}
        </button>

        {/* Token Display */}
        {token && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">JWT Token</h3>
            <code className="text-xs text-green-400 break-all">{token.substring(0, 50)}...</code>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Test Results</h2>
            </div>
            <div className="divide-y divide-gray-700">
              {results.map((result, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${getStatusColor(result.status)}`}>
                        {getStatusIcon(result.status)}
                      </span>
                      <span className="font-medium">{result.step}</span>
                    </div>
                    {result.duration && (
                      <span className="text-sm text-gray-400">{result.duration}ms</span>
                    )}
                  </div>
                  {result.error && (
                    <div className="text-sm text-red-400 bg-red-900/20 rounded p-2 mt-2">
                      {result.error}
                    </div>
                  )}
                  {result.response && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                        View Response
                      </summary>
                      <pre className="text-xs bg-gray-900 rounded p-2 mt-2 overflow-auto max-h-48">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {results.length > 0 && !isRunning && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Summary</h3>
            <div className="flex gap-6 text-sm">
              <span className="text-green-400">
                ✓ Passed: {results.filter((r) => r.status === "success").length}
              </span>
              <span className="text-red-400">
                ✗ Failed: {results.filter((r) => r.status === "error").length}
              </span>
              <span className="text-gray-400">
                ○ Skipped: {results.filter((r) => r.status === "skipped").length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

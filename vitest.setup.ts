/**
 * Setup file for Vitest
 * This file runs before all tests
 */

import { config } from "@vue/test-utils";
import { beforeEach, vi } from "vitest";

// Глобальные настройки для Vue Test Utils
config.global.mocks = {
  // Здесь можно добавить глобальные моки
};

// Мокаем fetch глобально
global.fetch = vi.fn();

// Очищаем все моки после каждого теста
beforeEach(() => {
  vi.clearAllMocks();
});

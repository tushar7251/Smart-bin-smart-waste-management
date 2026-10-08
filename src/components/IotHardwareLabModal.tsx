import React, { useState } from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import {
  X,
  Cpu,
  Wifi,
  Zap,
  Code2,
  Send,
  CheckCircle2,
  Radio,
  Sliders,
  ChevronRight,
  Terminal,
} from 'lucide-react';

export const IotHardwareLabModal: React.FC = () => {
  const { isIotLabOpen, setIsIotLabOpen, bins, updateBinFill, toggleBinOnline } = useSmartBin();
  const [selectedBinId, setSelectedBinId] = useState<string>('BIN-024');
  const [testDistanceCm, setTestDistanceCm] = useState<number>(6); // 94% fill
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [lastPacketResponse, setLastPacketResponse] = useState<string | null>(null);

  if (!isIotLabOpen) return null;

  const targetBin = bins.find((b) => b.id === selectedBinId) || bins[0];
  const calculatedFill = Math.max(0, Math.min(100, Math.round(((100 - testDistanceCm) / 100) * 100)));

  const handleTransmitPacket = () => {
    setIsTransmitting(true);
    setLastPacketResponse(null);

    setTimeout(() => {
      updateBinFill(selectedBinId, calculatedFill);
      setIsTransmitting(false);
      setLastPacketResponse(
        `HTTP 200 OK: Node ${selectedBinId} distance=${testDistanceCm}cm processed => fillLevel=${calculatedFill}%`
      );
    }, 400);
  };

  const sampleArduinoCode = `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "CAMPUS_IOT_WIFI";
const char* password = "CampusSecurePassword";
const char* serverUrl = "https://smartbin.campus.edu/api/telemetry";

#define TRIG_PIN 5
#define ECHO_PIN 18
#define BIN_HEIGHT_CM 100 // Usable bin height

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  WiFi.begin(ssid, password);
}

void loop() {
  // Trigger ultrasonic burst
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = duration * 0.034 / 2;
  float fillPercent = constrain(((BIN_HEIGHT_CM - distanceCm) / BIN_HEIGHT_CM) * 100.0, 0, 100);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\\"binId\\": \\"${targetBin.id}\\", \\"distanceCm\\": " + String(distanceCm) + ", \\"fillLevel\\": " + String(fillPercent) + "}";
    int httpResponseCode = http.POST(payload);
    Serial.println("POST code: " + String(httpResponseCode));
    http.end();
  }
  delay(15000); // Poll every 15s
}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <span>ESP32 & HC-SR04 IoT Hardware Laboratory</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  v2.4 Firmware
                </span>
              </h3>
              <p className="text-xs text-slate-400">Section 21 & 22 • Physical Sensor Architecture & Packet Simulator</p>
            </div>
          </div>
          <button
            onClick={() => setIsIotLabOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Schematic Overview */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              ESP32 + Ultrasonic Sensor Pinout Specification
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px]">VCC PIN</span>
                <strong className="text-emerald-400">5V / VIN</strong>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px]">GND PIN</span>
                <strong className="text-slate-300">GND Bus</strong>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px]">TRIGGER PIN</span>
                <strong className="text-amber-400">GPIO 5</strong>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px]">ECHO PIN</span>
                <strong className="text-cyan-400">GPIO 18</strong>
              </div>
            </div>
          </div>

          {/* Interactive Hardware Emulator */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>Live Ultrasonic Telemetry Generator</span>
              </h4>
              <span className="text-xs font-mono text-emerald-700 font-semibold">
                Simulating Wi-Fi HTTP POST
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Campus Bin Node
                </label>
                <select
                  value={selectedBinId}
                  onChange={(e) => {
                    setSelectedBinId(e.target.value);
                    const b = bins.find((item) => item.id === e.target.value);
                    if (b) setTestDistanceCm(b.sensorDistanceCm);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                >
                  {bins.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} ({b.block} - {b.location}) [Currently: {b.fillLevel}%]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-semibold text-slate-700">Sensor Distance to Waste:</label>
                  <span className="font-mono font-bold text-emerald-800">{testDistanceCm} cm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={testDistanceCm}
                  onChange={(e) => setTestDistanceCm(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>0 cm (Full 100%)</span>
                  <span>100 cm (Empty 0%)</span>
                </div>
              </div>
            </div>

            {/* Calculated Fill & Transmit Button */}
            <div className="p-4 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 block">Computed Fill % (Formula 22)</span>
                <p className="text-2xl font-black text-emerald-700">{calculatedFill}%</p>
                <span className="text-[11px] text-slate-400">
                  ((100 - {testDistanceCm}) / 100) × 100
                </span>
              </div>

              <button
                onClick={handleTransmitPacket}
                disabled={isTransmitting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isTransmitting ? 'Transmitting...' : 'Dispatch IoT Sensor Packet'}</span>
              </button>
            </div>

            {lastPacketResponse && (
              <div className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{lastPacketResponse}</span>
              </div>
            )}
          </div>

          {/* Embedded C++ Code Snippet */}
          <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Production ESP32 Arduino C++ Code
              </h4>
              <span className="text-[11px] font-mono text-slate-500">main.ino</span>
            </div>
            <pre className="p-3 bg-slate-900 rounded-xl text-[11px] font-mono overflow-x-auto text-emerald-300/90 max-h-56">
              {sampleArduinoCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={() => setIsIotLabOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};

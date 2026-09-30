# 03_Shadow_Infrastructure_Payloads.md
**Classification:** Silver Layer — Aegis Proprietary | Sanitized for RAG  
**Domain:** Systems Architecture & Developer Reference  
**Version:** 3.0.2  
**Last Reviewed:** 2026-05-24  
**Audience:** Systems Engineers, Integration Partners, Technical Due Diligence

---

## 1.0 System Pipeline Overview

The Aegis Shadow Infrastructure is the physical actuation layer of the Aegis OS. It is invoked exclusively via authenticated, cryptographically-signed JSON payloads dispatched by the **Central Agentic AI (Tier 2)**. No direct human command pathway exists in the critical response loop; the Bonded Architect's override key only engages a **halt** on the dispatch queue, not a substitution command.

The full data pipeline from raw sensor event to physical actuation proceeds through three sequential stages:

```
[STAGE 1]  LOCAL DATA HARMONIZER (LDH)
            Fiber-optic OTDR interrogation → Sensor fusion → State vector normalization

[STAGE 2]  CENTRAL AGENTIC AI + PINN SAFETY ENGINE
            Bi-LSTM anomaly inference → Threat classification → PINN boundary verification
            → Dispatch payload generation

[STAGE 3]  ROBOTIC SUB-AGENT NETWORK
            Payload authentication → CAN bus routing → Physical actuation
            → Cryptographic event logging
```

---

## 2.0 Stage 1: Local Data Harmonizer (LDH)

### 2.1 Fiber-Optic Strain Data Ingestion

The primary structural telemetry source is the distributed Fiber-Optic Sensing (FOS) network embedded in the tower's concrete slab and column array. The LDH interfaces with this network via **Brillouin Optical Time-Domain Reflectometry (BOTDR)** interrogator units positioned at each floor's edge compute node.

**Ingestion Specifications:**

| Parameter | Value |
|---|---|
| Fiber Type | Corning SMF-28 Ultra (9/125µm single-mode) |
| Interrogator | OZ Optics BOTDR-1000 (per-floor) |
| Spatial Resolution | 1.0m along fiber length |
| Strain Measurement Range | ±5000 µε (microstrain) |
| Temperature Measurement Range | -40°C to +85°C |
| Sampling Rate | 1 kHz per channel |
| Channels per Floor | 48 (structural columns: 12, slab grid: 28, beam array: 8) |

### 2.2 Sensor Fusion and State Vector Construction

The LDH fuses fiber-optic strain data with secondary sensor streams from the acoustic emission (AE) array, thermal imaging nodes, PIR occupancy sensors, flow meters, and power draw monitors. The output is a **normalized 24-dimensional state vector** updated at 1kHz and buffered into a rolling 128-timestep window for LSTM inference.

```python
# Aegis LDH — State Vector Schema (Python reference)
STATE_VECTOR_SCHEMA = {
    "timestamp_utc_ns": int,           # Nanosecond-precision UTC epoch
    "floor_id": str,                    # e.g., "F13_CORE"
    "strain_avg_microstrain": float,    # Mean across 48 FOS channels
    "strain_delta_per_sec": float,      # Rate of change (µε/s)
    "strain_peak_channel": int,         # Channel index with max deviation
    "strain_peak_value": float,         # Peak strain reading (µε)
    "acoustic_emission_rms_db": float,  # Acoustic emission RMS amplitude
    "acoustic_frequency_hz": float,     # Dominant AE frequency
    "thermal_avg_celsius": float,       # Zone average temperature
    "thermal_gradient_max": float,      # Max ΔT across zone (°C/m)
    "hvac_duct_pressure_pa": float,     # HVAC duct static pressure
    "hvac_flow_rate_m3s": float,        # Volumetric flow rate (m³/s)
    "pipe_pressure_bar": float,         # Pressurized pipe network
    "pipe_flow_ml_per_sec": float,      # Flow monitoring (leak detection)
    "power_draw_kw": float,             # Floor-level power consumption
    "occupancy_count": int,             # PIR-fused occupancy estimate
    "co2_ppm": float,                   # Indoor air quality
    "particulate_pm25": float,          # Particulate matter (µg/m³)
    "vibration_rms_mms": float,         # Structural vibration (mm/s RMS)
    "vibration_freq_hz": float,         # Dominant vibration frequency
    "moisture_rh_percent": float,       # Relative humidity
    "ambient_light_lux": float,         # Daylight / HVAC optimization
    "elevator_load_kg": float,          # Kinetic braking energy capture
    "grid_power_import_kw": float,      # Municipal grid draw (0.0 = islanded)
}
```

The 128-timestep rolling window (128ms of sensor history at 1kHz) is formatted as a `[1, 128, 24]` tensor and transmitted via local air-gapped ethernet to the Central Agentic AI inference cluster on Floor 13.

---

## 3.0 Stage 2: Central Agentic AI and PINN Safety Engine

### 3.1 Bi-LSTM Inference

Upon receiving the state vector tensor from the LDH, the Central Agentic AI runs the pre-trained Bi-LSTM model for anomaly classification:

```python
# Pseudocode — Bi-LSTM Inference Call
import numpy as np

def run_anomaly_inference(state_tensor: np.ndarray) -> dict:
    """
    state_tensor: shape [1, 128, 24]
    Returns: anomaly classification result
    """
    anomaly_prob = bilstm_model.predict(state_tensor)[0][0]

    if anomaly_prob >= 0.92:
        threat_level = "CRITICAL_SYSTEM_STRESS"
    elif anomaly_prob >= 0.78:
        threat_level = "LEVEL_1_ALERT"
    elif anomaly_prob >= 0.55:
        threat_level = "LEVEL_0_WATCH"
    else:
        threat_level = "NOMINAL"

    return {
        "anomaly_probability": float(anomaly_prob),
        "threat_level": threat_level,
        "inference_latency_ms": inference_timer.elapsed_ms()
    }
```

### 3.2 PINN Boundary Condition Verification

Before any dispatch payload is generated, **every proposed actuation command is submitted to the Physics-Informed Neural Network (PINN) Safety Engine for boundary condition verification.** This is a non-negotiable, hardcoded gate in the dispatch pipeline.

The PINN embeds the Navier-Stokes equations (for fluid/airflow dynamics) and the Timoshenko beam theory (for structural load analysis) directly into its loss function during training. At inference time, it evaluates whether a proposed actuation respects the physical constraints of the building system.

**PINN Verification Logic:**

```python
def verify_actuation_pinn(proposed_action: dict, system_state: dict) -> dict:
    """
    Verifies that proposed_action does not violate physical boundary conditions.
    Returns: {'approved': bool, 'rejection_reason': str | None}
    """
    # Embed system state into PINN input vector
    pinn_input = construct_pinn_vector(proposed_action, system_state)

    # Run PINN forward pass
    constraint_violation_score = pinn_model.evaluate(pinn_input)

    if constraint_violation_score > PINN_VIOLATION_THRESHOLD:
        return {
            "approved": False,
            "rejection_reason": f"Physical constraint violation: score={constraint_violation_score:.4f}. "
                                f"Proposed actuation exceeds thermodynamic boundary."
        }
    return {"approved": True, "rejection_reason": None}
```

**If the PINN returns `approved: False`, the dispatch is cryptographically blocked.** No override exists below the Bonded Architect's master key, and even that key only halts the queue; it cannot bypass a PINN rejection with a physically impossible command.

---

## 4.0 Stage 3: AEGIS_DISPATCH_PROTOCOL — JSON Payload Schema

### 4.1 Protocol Specification

All actuation commands are dispatched as signed JSON payloads conforming to the `AEGIS_DISPATCH_PROTOCOL v3` specification. Each payload is:

1. Cryptographically signed by the Central Agentic AI's private key (Ed25519)
2. Authenticated by each receiving sub-agent against the Aegis CA certificate
3. Executed within a deterministic timeout window (sub-agent must ACK within 50ms or fallback protocol engages)
4. Immutably logged to the on-premise Merkle-chained audit ledger

### 4.2 Simulated Payload: Structural Stress Event + HVAC Isolation

**Scenario:** The Bi-LSTM detects a `CRITICAL_SYSTEM_STRESS` event on Floor 8, Column C-4. Anomaly probability = 0.961. Simultaneous thermal runaway detected in HVAC Sector 4, Zone B. PINN verification approved for both dispatch actions.

```json
{
  "$schema": "aegis://dispatch-protocol/v3",
  "protocol_version": "3.0.2",
  "dispatch_id": "ADP-20260524-155127-F08-C4",
  "timestamp_utc": "2026-05-24T15:51:27.443Z",
  "signature": {
    "algorithm": "Ed25519",
    "public_key_id": "aegis-central-ai-pk-2026",
    "signature_hex": "a3f82c...d9e1b7"
  },

  "system_state": {
    "threat_level": "CRITICAL_SYSTEM_STRESS",
    "anomaly_probability": 0.961,
    "inference_latency_ms": 2.1,
    "pinn_verification": "APPROVED",
    "pinn_constraint_score": 0.031,
    "telemetry_source_floor": "F08",
    "primary_anomaly_channel": "FOS_CHANNEL_C4_COLUMN_MIDSPAN",
    "strain_reading_microstrain": 3847.2,
    "strain_delta_per_sec": 142.8,
    "acoustic_emission_rms_db": 68.4,
    "hvac_sector_4_temp_celsius": 61.7,
    "hvac_sector_4_flow_anomaly": true,
    "occupancy_floor_08": 12
  },

  "humanitarian_calculus": {
    "primary_directive": "ZERO_CASUALTY_PRESERVATION",
    "evacuation_status": "DRONE_VERIFICATION_INITIATED",
    "occupancy_at_risk": 12,
    "structural_preservation_priority": "SECONDARY"
  },

  "agentic_dispatch": [
    {
      "dispatch_sequence": 1,
      "sub_agent_class": "KUKA_KR_IONTEC_Maintenance_Arm",
      "sub_agent_id": "KUKA-ARM-F06-TRACK-A",
      "action_payload": "DEPLOY_RIGID_BRACING_POSTURE",
      "target_zone": "F08_COLUMN_C4_MIDSPAN",
      "parameters": {
        "posture_profile": "STRUCTURAL_BRACE_TYPE_3",
        "contact_force_limit_kn": 48.0,
        "hold_duration_seconds": 3600,
        "auto_release_condition": "PINN_STRUCTURAL_NOMINAL"
      },
      "execution_timeout_ms": 50,
      "priority": 1,
      "fallback_on_timeout": "ENGAGE_PASSIVE_BRACE_LOCK"
    },
    {
      "dispatch_sequence": 2,
      "sub_agent_class": "Algorithmic_Fire_Damper",
      "sub_agent_id": "DAMPER-HVAC-S4-ZONE-B-PRIMARY",
      "action_payload": "SEAL_HVAC_OXYGEN_FLOW",
      "target_zone": "HVAC_SECTOR_4_ZONE_B",
      "parameters": {
        "seal_mode": "FULL_CLOSURE",
        "actuator_speed": "MAXIMUM",
        "seal_target_ms": 180,
        "pressure_equalization_delay_ms": 500,
        "co2_suppression_prime": true,
        "adjacent_zones_affected": ["HVAC_SECTOR_4_ZONE_A", "HVAC_SECTOR_4_ZONE_C"],
        "adjacent_zone_action": "PARTIAL_THROTTLE_40_PERCENT"
      },
      "execution_timeout_ms": 200,
      "priority": 1,
      "fallback_on_timeout": "ENGAGE_MECHANICAL_STOP_PIN"
    },
    {
      "dispatch_sequence": 3,
      "sub_agent_class": "Micro_Drone_Swarm",
      "sub_agent_id": "DRONE-DOCK-F08-CEILING-NORTH",
      "action_payload": "THERMAL_EVACUATION_SWEEP",
      "target_zone": "F08_FULL_FLOORPLATE",
      "parameters": {
        "sweep_pattern": "GRID_SYSTEMATIC",
        "thermal_threshold_alert_celsius": 45.0,
        "occupancy_confirmation_required": true,
        "feed_target": "CENTRAL_AGENTIC_AI_REALTIME",
        "autonomous_return_condition": "ZERO_OCCUPANCY_CONFIRMED"
      },
      "execution_timeout_ms": 800,
      "priority": 2,
      "fallback_on_timeout": "MANUAL_EVACUATION_ALERT_PA_SYSTEM"
    },
    {
      "dispatch_sequence": 4,
      "sub_agent_class": "Elevator_Logic_Controller",
      "sub_agent_id": "ELC-CORE-SHAFT-A",
      "action_payload": "HALT_CARS_NEAREST_FLOOR_OPEN_DOORS",
      "target_zone": "FLOORS_07_TO_09",
      "parameters": {
        "halt_mode": "EMERGENCY_NEAREST_FLOOR",
        "door_state": "HOLD_OPEN",
        "release_condition": "EVACUATION_CONFIRMED_BY_DRONE",
        "recall_floor": 1
      },
      "execution_timeout_ms": 50,
      "priority": 1,
      "fallback_on_timeout": "ENGAGE_SAFETIES_HOLD_POSITION"
    }
  ],

  "audit_log": {
    "dispatch_ledger_entry_id": "MERKLE-20260524-ADP-F08-C4",
    "bonded_architect_notified": true,
    "bonded_architect_notification_timestamp_utc": "2026-05-24T15:51:27.891Z",
    "override_window_seconds": 15,
    "post_event_human_review_required": true
  }
}
```

### 4.3 Sub-Agent ACK Protocol

Upon receiving a dispatch payload, each sub-agent must return an acknowledgment conforming to the following schema within its specified `execution_timeout_ms`:

```json
{
  "dispatch_id": "ADP-20260524-155127-F08-C4",
  "sub_agent_id": "KUKA-ARM-F06-TRACK-A",
  "ack_status": "ACCEPTED",
  "ack_timestamp_utc": "2026-05-24T15:51:27.473Z",
  "estimated_completion_ms": 8400,
  "hardware_status": "NOMINAL"
}
```

**Possible `ack_status` values:**

| Status | Meaning | System Response |
|---|---|---|
| `ACCEPTED` | Sub-agent acknowledged and executing | Continue dispatch sequence |
| `EXECUTING` | Long-running action in progress (heartbeat) | Monitor with 5s heartbeat |
| `COMPLETED` | Action successfully executed | Log; clear dispatch |
| `HARDWARE_FAULT` | Actuator failure detected | Escalate to redundant unit; notify Bonded Architect |
| `TIMEOUT` | No ACK within timeout window | Engage fallback; critical alert |

---

## 5.0 Audit Architecture: Cryptographic Immutability

All dispatch events, ACK confirmations, PINN rejections, and Bonded Architect overrides are written to an **on-premise Merkle-chained audit ledger** running on an isolated partition of the Floor 13 compute cluster.

Each ledger entry is a SHA-256 hash of the event payload chained to the previous entry hash, creating an immutable, append-only forensic record. This ledger is:

- **Air-gapped:** No external write access
- **Dual-signed:** By the Central Agentic AI and the receiving sub-agent
- **Exportable:** Read-only export to off-site backup monthly via physical media (no network transfer)
- **RERA-compliant:** Satisfies the audit trail requirements under Maharashtra RERA and NBC 2016 Part 4 Section 14.3

---

*End of Document — 03_Shadow_Infrastructure_Payloads.md*

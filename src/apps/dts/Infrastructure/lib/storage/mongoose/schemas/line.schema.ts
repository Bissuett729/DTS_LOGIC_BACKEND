import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// Genera los 24 slots horarios con standard por defecto de 50
// Ej: { label: "00:00 - 01:00", startHour: 0, endHour: 1, standard: 50 }
// ─────────────────────────────────────────────────────────────────────────────
export function generateHourlySlots(defaultStandard = 50): HourlyStandard[] {
  return Array.from({ length: 24 }, (_, i) => {
    const start = String(i).padStart(2, '0') + ':00';
    // Slot 23 → "23:00 - 24:00"  (endHour = 24, evitamos % 24 que produce 0)
    const endVal = i + 1;
    const end =
      endVal === 24 ? '24:00' : String(endVal).padStart(2, '0') + ':00';
    return {
      label: `${start} - ${end}`,
      startHour: i,
      endHour: endVal,
      standard: defaultStandard,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// HourlyStandard — slot individual de 1 hora dentro de un stage
// ─────────────────────────────────────────────────────────────────────────────
@Schema({ _id: false })
export class HourlyStandard {
  /** Etiqueta legible: "00:00 - 01:00" */
  @Prop({ type: String, required: true })
  label: string;

  /** Hora de inicio (0–23) */
  @Prop({ type: Number, required: true, min: 0, max: 23 })
  startHour: number;

  /** Hora de fin (1–24, donde 24 = medianoche del día siguiente) */
  @Prop({ type: Number, required: true, min: 1, max: 24 })
  endHour: number;

  /** Unidades estándar esperadas en esta hora */
  @Prop({ type: Number, default: 50, min: 0 })
  standard: number;
}

export const HourlyStandardSchema =
  SchemaFactory.createForClass(HourlyStandard);

// ─────────────────────────────────────────────────────────────────────────────
// Stage — etapa dentro de una línea (FA, FT, PA, etc.)
// ─────────────────────────────────────────────────────────────────────────────
@Schema({ _id: true, timestamps: false })
export class Stage {
  /** Nombre del stage, ej: "FA", "FT", "PA" */
  @Prop({ type: String, required: true, trim: true })
  name: string;

  /** 24 slots horarios generados automáticamente al crear el stage */
  @Prop({ type: [HourlyStandardSchema], default: () => generateHourlySlots() })
  hourlyStandards: HourlyStandard[];
}

export const StageSchema = SchemaFactory.createForClass(Stage);

// ─────────────────────────────────────────────────────────────────────────────
// Line — documento principal
// ─────────────────────────────────────────────────────────────────────────────
@Schema({ collection: 'Line', timestamps: true })
export class Line extends Document {
  /** Nombre de la línea, ej: "Línea 1", "L1" */
  @Prop({ type: String, required: true, trim: true, unique: true })
  name: string;

  /** Salida estándar global de la línea (referencia general) */
  @Prop({ type: Number, default: 50, min: 0 })
  standardOutput: number;

  /** Stages de la línea, cada uno con sus 24 slots horarios */
  @Prop({ type: [StageSchema], default: [] })
  stages: Stage[];

  /** Indica si la línea está activa */
  @Prop({ type: Boolean, default: true })
  active: boolean;
}

export const LineSchema = SchemaFactory.createForClass(Line);

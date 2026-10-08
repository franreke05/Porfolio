"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DayDto } from "@/lib/booking/contract";
import styles from "./contact.module.css";
import { addDays, businessWeeks, civilLong, monthLabel, monthOf, parseCivil } from "./time";

const WEEKDAYS = [
  { short: "L", long: "lunes" },
  { short: "M", long: "martes" },
  { short: "X", long: "miércoles" },
  { short: "J", long: "jueves" },
  { short: "V", long: "viernes" },
];

const navButton =
  "inline-flex size-11 items-center justify-center border-[1.5px] border-[color:var(--foreground)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-elevated)] disabled:cursor-not-allowed disabled:border-[color:var(--border-hover)] disabled:text-[color:var(--border-hover)] disabled:hover:bg-transparent";

type BookingCalendarProps = {
  /** Every business day the API listed; a day with no slots is not selectable. */
  days: DayDto[];
  /** Today's civil date in the booking time zone. */
  today: string;
  month: string;
  minMonth: string;
  maxMonth: string;
  onMonthChange: (month: string) => void;
  selected: string | null;
  onSelect: (date: string) => void;
  /** Below `lg` only the week of the selected day stays visible. */
  collapsed: boolean;
  onExpand: () => void;
};

function shiftMonth(month: string, amount: number): string {
  const date = parseCivil(`${month}-01`);
  date.setUTCMonth(date.getUTCMonth() + amount);
  return date.toISOString().slice(0, 7);
}

export function BookingCalendar({
  days,
  today,
  month,
  minMonth,
  maxMonth,
  onMonthChange,
  selected,
  onSelect,
  collapsed,
  onExpand,
}: BookingCalendarProps) {
  const slotCount = useMemo(() => new Map(days.map((day) => [day.date, day.slots.length])), [days]);
  const available = useMemo(
    () =>
      days
        .filter((day) => day.slots.length > 0)
        .map((day) => day.date)
        .sort(),
    [days],
  );
  const weeks = useMemo(() => businessWeeks(month), [month]);

  const [focused, setFocused] = useState<string | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);

  // Roving tabindex: exactly one day of the visible month is in the tab order.
  const inMonth = available.filter((date) => monthOf(date) === month);
  const tabStop =
    [focused, selected].find((date) => date && inMonth.includes(date)) ?? inMonth[0] ?? null;

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    const cell = grid.current?.querySelector<HTMLElement>(`[data-date="${target}"]`);
    if (cell && cell.offsetParent !== null) {
      cell.focus();
      pendingFocus.current = null;
    }
  });

  function moveTo(date: string | undefined) {
    if (!date) return;
    pendingFocus.current = date;
    setFocused(date);
    if (monthOf(date) !== month) onMonthChange(monthOf(date));
  }

  function stepWeeks(from: string, direction: 1 | -1): string | undefined {
    const first = available[0];
    const last = available[available.length - 1];
    let cursor = addDays(from, 7 * direction);
    while (cursor >= first && cursor <= last) {
      if (slotCount.get(cursor)) return cursor;
      cursor = addDays(cursor, 7 * direction);
    }
    return undefined;
  }

  function sameWeek(from: string): string[] {
    const weekday = parseCivil(from).getUTCDay();
    const monday = addDays(from, 1 - weekday);
    const friday = addDays(monday, 4);
    return available.filter((date) => date >= monday && date <= friday);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: string) {
    const index = available.indexOf(date);
    let target: string | undefined;
    switch (event.key) {
      case "ArrowRight":
        target = available[index + 1];
        break;
      case "ArrowLeft":
        target = available[index - 1];
        break;
      case "ArrowDown":
        target = stepWeeks(date, 1);
        break;
      case "ArrowUp":
        target = stepWeeks(date, -1);
        break;
      case "Home":
        target = sameWeek(date)[0];
        break;
      case "End":
        target = sameWeek(date).at(-1);
        break;
      case "PageDown":
        target = available.find((candidate) => monthOf(candidate) > month);
        break;
      case "PageUp":
        target = available.findLast((candidate) => monthOf(candidate) < month);
        break;
      default:
        return;
    }
    event.preventDefault();
    moveTo(target);
  }

  const selectedWeek = selected ? weeks.findIndex((week) => week.includes(selected)) : -1;
  const hideOthers = collapsed && selectedWeek >= 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p
          id="booking-month"
          aria-live="polite"
          className="font-display text-2xl leading-none text-[color:var(--foreground)]"
        >
          {monthLabel(month)}
        </p>
        <div className={`flex gap-2 ${hideOthers ? "max-lg:hidden" : ""}`}>
          <button
            type="button"
            className={navButton}
            aria-label="Mes anterior"
            disabled={month <= minMonth}
            onClick={() => onMonthChange(shiftMonth(month, -1))}
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            className={navButton}
            aria-label="Mes siguiente"
            disabled={month >= maxMonth}
            onClick={() => onMonthChange(shiftMonth(month, 1))}
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
        {hideOthers ? (
          <button
            type="button"
            className="min-h-11 px-2 text-sm font-semibold underline decoration-2 underline-offset-4 lg:hidden"
            onClick={onExpand}
          >
            Ver el mes
          </button>
        ) : null}
      </div>

      <div
        ref={grid}
        role="grid"
        aria-labelledby="booking-month"
        className="mt-4 grid gap-1.5 sm:gap-2"
      >
        <div role="row" className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday.long}
              role="columnheader"
              aria-label={weekday.long}
              className="label-mono pb-1 text-center text-[color:var(--muted)]"
            >
              {weekday.short}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div
            key={week.find(Boolean) ?? weekIndex}
            role="row"
            className={`grid grid-cols-5 gap-1.5 sm:gap-2 ${
              hideOthers && weekIndex !== selectedWeek ? "max-lg:hidden" : ""
            }`}
          >
            {week.map((date, column) => {
              if (!date) {
                return <div key={`empty-${column}`} role="gridcell" className="aspect-square" />;
              }
              const count = slotCount.get(date) ?? 0;
              const isToday = date === today;
              const isSelected = date === selected;
              const dayNumber = Number(date.slice(8));
              const numeral = (
                <span
                  className={`font-display text-xl leading-none sm:text-2xl ${
                    isToday ? "underline decoration-2 underline-offset-[5px]" : ""
                  }`}
                >
                  {dayNumber}
                </span>
              );
              const todayLabel = isToday ? (
                <span
                  aria-hidden="true"
                  className="label-mono absolute left-1.5 top-1 text-[0.5625rem] leading-none"
                >
                  Hoy
                </span>
              ) : null;

              if (count === 0) {
                return (
                  <div
                    key={date}
                    role="gridcell"
                    aria-disabled="true"
                    data-date={date}
                    data-state="unavailable"
                    className={`${styles.hatch} relative flex aspect-square items-center justify-center border border-[color:var(--border-hover)] text-[color:var(--muted)]`}
                  >
                    {todayLabel}
                    {numeral}
                    <span className="sr-only">
                      {`, ${civilLong(date)}${isToday ? ", hoy" : ""}, sin huecos`}
                    </span>
                  </div>
                );
              }

              return (
                <div key={date} role="gridcell" aria-selected={isSelected}>
                  <button
                    type="button"
                    data-date={date}
                    data-state={isSelected ? "selected" : "available"}
                    tabIndex={date === tabStop ? 0 : -1}
                    aria-pressed={isSelected}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={`${civilLong(date)}${isToday ? ", hoy" : ""}, ${count} ${
                      count === 1 ? "hueco" : "huecos"
                    }`}
                    onClick={() => {
                      setFocused(date);
                      onSelect(date);
                    }}
                    onFocus={() => setFocused(date)}
                    onKeyDown={(event) => onKeyDown(event, date)}
                    className={`relative flex aspect-square w-full items-center justify-center border-[1.5px] border-[color:var(--foreground)] transition-colors duration-100 ${
                      isSelected
                        ? "bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-[var(--shadow-hard)]"
                        : "bg-[color:var(--background)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-elevated)]"
                    }`}
                  >
                    {todayLabel}
                    {numeral}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <ul
        aria-label="Leyenda del calendario"
        className={`mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[color:var(--surface-foreground)] ${
          hideOthers ? "max-lg:hidden" : ""
        }`}
      >
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-4 border-[1.5px] border-[color:var(--foreground)]"
          />
          Disponible
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`${styles.hatch} size-4 border border-[color:var(--border-hover)]`}
          />
          Sin huecos
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-4 border-[1.5px] border-[color:var(--foreground)] bg-[color:var(--primary)]"
          />
          Seleccionado
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="font-display text-base leading-none underline decoration-2 underline-offset-4"
          >
            {Number(today.slice(8))}
          </span>
          Hoy
        </li>
      </ul>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div aria-busy="true" data-state="calendar-loading">
      <p className="sr-only" role="status">
        Cargando disponibilidad…
      </p>
      <div aria-hidden="true">
        <div className={`${styles.skeleton} h-7 w-44 bg-[color:var(--surface-elevated)]`} />
        <div className="mt-9 grid grid-cols-5 gap-1.5 sm:gap-2">
          {Array.from({ length: 20 }, (_, index) => (
            <div
              key={index}
              className={`${styles.skeleton} aspect-square border border-[color:var(--border-hover)] bg-[color:var(--surface)]`}
              style={{ animationDelay: `${(index % 5) * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

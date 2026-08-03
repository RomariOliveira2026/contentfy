# Success Score — Formulas

## Weighted overall

```
score =
  knowledge   * w_k +
  application * w_a +
  consistency * w_c +
  result      * w_r
```

Weights are normalized to sum `1.0` at runtime.

### Defaults

| Pillar | Weight |
|---|---|
| knowledge | 0.30 |
| application | 0.25 |
| consistency | 0.25 |
| result | 0.20 |

## Pillar normalization

Each pillar maps raw counts to 0–100 using `targets` in config:

| Pillar | Primary inputs | Default targets |
|---|---|---|
| knowledge | modulesCompleted (+ completion ratio) | 20 modules |
| application | applicationTasks | 12 |
| consistency | activeDays (55%) + streakDays (45%) | 20 / 30 |
| result | goalsCompleted (45%) + competenciesAcquired (55%) | 2 / 6 |

## Grades

| Grade | Threshold (default) |
|---|---|
| master | ≥ 85 |
| rise | ≥ 65 |
| grow | ≥ 40 |
| seed | < 40 |

## Habits

Milestones (default): `7, 21, 30, 60, 90` days.

## Consistency bands

| Band | Score |
|---|---|
| excellent | ≥ 80 |
| good | ≥ 60 |
| fair | else |
| declining | < 35 or trend down |

## Override

```bash
SUCCESS_SCORE_CONFIG_JSON='{"weights":{"knowledge":0.35,"application":0.25,"consistency":0.2,"result":0.2}}'
```

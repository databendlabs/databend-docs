---
title: UNSET
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.467"/>

Reverts one or more system settings to their default levels and values. For more information about the setting levels, see [Setting Levels](03-show-settings.md#setting-levels). To show all the current settings, use [SHOW SETTINGS](03-show-settings.md).

See also: [SET](02-set-global.md)

## Syntax

```sql
-- Unset one setting
UNSET [ SESSION ] <setting_name> 

-- Unset multiple settings
UNSET [ SESSION ] ( <setting_name>, <setting_name> ... )
```

| Parameter | Description                                                                                                                                               |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| SESSION   | Removes the session-level (current session) setting of a global-level setting, reverting the setting back to the global level and its global-level value. |

## Examples

This example uses UNSET to remove the global-level setting for timezone, reverting it back to its default value and level:

```sql
SHOW SETTINGS LIKE 'timezone';

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   name   │  value │ default │                                range                                │  level  │     description    │  type  │
├──────────┼────────┼─────────┼─────────────────────────────────────────────────────────────────────┼─────────┼────────────────────┼────────┤
│ timezone │ UTC    │ UTC     │ ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa... │ DEFAULT │ Sets the timezone. │ String │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Sets timezone to 'Asia/Shanghai' at global level
SET GLOBAL timezone = 'Asia/Shanghai';
SHOW SETTINGS LIKE 'timezone';

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   name   │     value     │ default │                                range                                │  level │     description    │  type  │
├──────────┼───────────────┼─────────┼─────────────────────────────────────────────────────────────────────┼────────┼────────────────────┼────────┤
│ timezone │ Asia/Shanghai │ UTC     │ ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa... │ GLOBAL │ Sets the timezone. │ String │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Removes the global-level setting for timezone
UNSET timezone;
SHOW SETTINGS LIKE 'timezone';

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   name   │  value │ default │                                range                                │  level  │     description    │  type  │
├──────────┼────────┼─────────┼─────────────────────────────────────────────────────────────────────┼─────────┼────────────────────┼────────┤
│ timezone │ UTC    │ UTC     │ ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa... │ DEFAULT │ Sets the timezone. │ String │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

This example uses UNSET SESSION to remove the session-level setting for timezone, reverting it back to the global-level setting:

```sql
SHOW SETTINGS LIKE 'timezone';

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   name   │  value │ default │                                range                                │  level  │     description    │  type  │
├──────────┼────────┼─────────┼─────────────────────────────────────────────────────────────────────┼─────────┼────────────────────┼────────┤
│ timezone │ UTC    │ UTC     │ ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa... │ DEFAULT │ Sets the timezone. │ String │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Sets timezone to 'Asia/Shanghai' at global level
SET GLOBAL timezone = 'Asia/Shanghai';
SHOW SETTINGS LIKE 'timezone';
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   name   │     value     │ default │                                range                                │  level │     description    │  type  │
├──────────┼───────────────┼─────────┼─────────────────────────────────────────────────────────────────────┼────────┼────────────────────┼────────┤
│ timezone │ Asia/Shanghai │ UTC     │ ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa... │ GLOBAL │ Sets the timezone. │ String │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Set timezone to 'America/Santiago' in current session
SET timezone = 'America/Santiago';
SHOW SETTINGS LIKE 'timezone';
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   name   │       value      │ default │                                range                                │  level  │     description    │  type  │
├──────────┼──────────────────┼─────────┼─────────────────────────────────────────────────────────────────────┼─────────┼────────────────────┼────────┤
│ timezone │ America/Santiago │ UTC     │ ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa... │ SESSION │ Sets the timezone. │ String │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

UNSET SESSION timezone;
SHOW SETTINGS LIKE 'timezone';

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   name   │     value     │ default │                                range                                │  level │     description    │  type  │
├──────────┼───────────────┼─────────┼─────────────────────────────────────────────────────────────────────┼────────┼────────────────────┼────────┤
│ timezone │ Asia/Shanghai │ UTC     │ ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa... │ GLOBAL │ Sets the timezone. │ String │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
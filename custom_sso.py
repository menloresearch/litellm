from fastapi_sso.sso.base import OpenID

import litellm
from litellm.proxy._types import LitellmUserRoles, SSOUserDefinedValues


async def custom_sso_handler(result: OpenID) -> SSOUserDefinedValues | None:
    # this is adapted from ui_sso.py
    user_email: str | None = getattr(result, "email", None)
    user_id: str | None = getattr(result, "id", None) if result is not None else None

    if user_id is None and result is not None:
        _first_name = getattr(result, "first_name", "") or ""
        _last_name = getattr(result, "last_name", "") or ""
        user_id = _first_name + _last_name

    if user_email is not None and (user_id is None or len(user_id) == 0):
        user_id = user_email

    if user_id is None:
        return None

    return SSOUserDefinedValues(
        models=[],
        user_id=user_id,
        user_email=user_email,
        max_budget=litellm.max_internal_user_budget,
        user_role=LitellmUserRoles.INTERNAL_USER.value,
        budget_duration=litellm.internal_user_budget_duration,
    )

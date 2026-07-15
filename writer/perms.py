import frappe
from frappe.utils.user import is_website_user
try:
    from drive.api.permissions import user_has_permission
except ImportError:
    def user_has_permission(*a, **kw): return True


def check_app_permission():
    if frappe.session.user == "Administrator":
        return True
    if is_website_user():
        return False
    # Hide the app tile when its module is blocked for the user (e.g. via Module Profile)
    if "Writer" in frappe.get_cached_doc("User", frappe.session.user).get_blocked_modules():
        return False
    return True


def has_permission(doc, ptype, user=None):
    if ptype == "create":
        return True
    file = frappe.get_value("Drive File", {"doc": doc.name}, "name")
    if not file:
        return False
    return user_has_permission(file, ptype, user)

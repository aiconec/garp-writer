import frappe
try:
    from drive.api.permissions import user_has_permission
except ImportError:
    def user_has_permission(*a, **kw): return True


def has_permission(doc, ptype, user=None):
    if ptype == "create":
        return True
    file = frappe.get_value("Drive File", {"doc": doc.name}, "name")
    if not file:
        return False
    return user_has_permission(file, ptype, user)

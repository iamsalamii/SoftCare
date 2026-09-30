import re
import os

# 1. Add HttpDelete to InvoicesController.cs
invoice_cs_path = 'backend/src/SoftCare.API/Controllers/InvoicesController.cs'
with open(invoice_cs_path, 'r', encoding='utf-8') as f:
    inv_content = f.read()

if 'HttpDelete' not in inv_content:
    delete_inv = """
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInvoice(string id)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null || !invoice.IsActive)
            return NotFound();

        invoice.IsActive = false;
        invoice.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}"""
    inv_content = inv_content.replace('\n}\n', delete_inv + '\n', 1)
    with open(invoice_cs_path, 'w', encoding='utf-8') as f:
        f.write(inv_content)

# 2. Add delete to invoices in apiService.ts
api_path = 'src/services/apiService.ts'
with open(api_path, 'r', encoding='utf-8') as f:
    api_content = f.read()

if 'delete: (id: string) => apiClient.delete(`/invoices/${id}`)' not in api_content:
    api_content = api_content.replace("update: (id: string, invoice: any) => apiClient.put<any>(`/invoices/${id}`, invoice),",
                                      "update: (id: string, invoice: any) => apiClient.put<any>(`/invoices/${id}`, invoice),\n    delete: (id: string) => apiClient.delete(`/invoices/${id}`),")
    with open(api_path, 'w', encoding='utf-8') as f:
        f.write(api_content)

# 3. Update AppContext.tsx delete functions
app_path = 'src/context/AppContext.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_content = f.read()

old_del_inv = r'const deleteInvoice = async \(id: string\) => \{\s*setInvoices\(prev => prev\.filter\(inv => inv\.id !== id\)\);\s*success\([^\)]+\);\s*\};'
new_del_inv = """const deleteInvoice = async (id: string) => {
    try {
      await apiService.invoices.delete(id);
      setInvoicesState(prev => prev.filter(inv => inv.id !== id));
      success('Facture supprimée');
    } catch (err: any) {
      showError(err);
    }
  };"""
app_content = re.sub(old_del_inv, new_del_inv, app_content)

old_del_bed = r'const deleteBed = async \(id: string\) => \{\s*setBeds\(prev => prev\.filter\(b => b\.id !== id\)\);\s*success\([^\)]+\);\s*\};'
new_del_bed = """const deleteBed = async (id: string) => {
    try {
      await apiService.beds.delete(id);
      setBedsState(prev => prev.filter(b => b.id !== id));
      success('Lit supprimé');
    } catch (err: any) {
      showError(err);
    }
  };"""
app_content = re.sub(old_del_bed, new_del_bed, app_content)

old_del_sur = r'const deleteSurgery = async \(id: string\) => \{\s*setSurgeries\(prev => prev\.filter\(s => s\.id !== id\)\);\s*success\([^\)]+\);\s*\};'
new_del_sur = """const deleteSurgery = async (id: string) => {
    try {
      await apiService.surgery.delete(id);
      setSurgeriesState(prev => prev.filter(s => s.id !== id));
      success('Chirurgie supprimée');
    } catch (err: any) {
      showError(err);
    }
  };"""
app_content = re.sub(old_del_sur, new_del_sur, app_content)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_content)

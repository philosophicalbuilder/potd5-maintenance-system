"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import BackgroundPaths from "./components/background-paths"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MaintenanceRequest {
  id: number
  date: string
  room: string
  requested_by: string
  description: string
  priority: string
}

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://potd5-maintenance-system-production.up.railway.app/api'
  : 'http://localhost:8000/api'

export default function Component() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    date: "",
    room: "",
    by: "",
    description: "",
    priority: "",
  })

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null)
  const [editFormData, setEditFormData] = useState({
    date: "",
    room: "",
    by: "",
    description: "",
    priority: "",
  })

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteRequestId, setDeleteRequestId] = useState<number | null>(null)
  const [showProgressImage, setShowProgressImage] = useState(false)

  // API Functions
  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/requests.php`)
      if (!response.ok) throw new Error('Failed to fetch requests')
      const data = await response.json()
      setRequests(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  const createRequest = async (requestData: any) => {
    try {
      // Map 'by' field to 'requested_by' for API
      const apiData = {
        ...requestData,
        requested_by: requestData.by
      }
      delete apiData.by

      const response = await fetch(`${API_BASE_URL}/requests.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })
      if (!response.ok) throw new Error('Failed to create request')
      const newRequest = await response.json()
      setRequests(prev => [newRequest, ...prev])
      return newRequest
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request')
      throw err
    }
  }

  const updateRequest = async (id: number, requestData: any) => {
    try {
      // Map 'by' field to 'requested_by' for API
      const apiData = {
        ...requestData,
        requested_by: requestData.by
      }
      delete apiData.by

      const response = await fetch(`${API_BASE_URL}/requests.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...apiData }),
      })
      if (!response.ok) throw new Error('Failed to update request')
      const updatedRequest = await response.json()
      setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request')
      throw err
    }
  }

  const deleteRequest = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests.php?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete request')
      setRequests(prev => prev.filter(req => req.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete request')
      throw err
    }
  }

  // Load requests on component mount
  useEffect(() => {
    fetchRequests()
  }, [])

  const handleAdd = async () => {
    if (formData.date && formData.room && formData.by && formData.description && formData.priority) {
      try {
        await createRequest(formData)
        handleClear()
      } catch (err) {
        console.error('Failed to create request:', err)
      }
    }
  }

  const handleClear = () => {
    setFormData({
      date: "",
      room: "",
      by: "",
      description: "",
      priority: "",
    })
  }

  const handleDeleteClick = (id: number) => {
    setDeleteRequestId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteRequestId !== null) {
      try {
        await deleteRequest(deleteRequestId)
        setIsDeleteDialogOpen(false)
        setDeleteRequestId(null)
      } catch (err) {
        console.error('Failed to delete request:', err)
      }
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setDeleteRequestId(null)
  }

  const handleOpenUpdateDialog = (request: MaintenanceRequest) => {
    setEditingRequest(request)
    setEditFormData({
      date: request.DATE || request.date, // Handle both DATE and date fields
      room: request.room,
      by: request.requested_by,
      description: request.description,
      priority: request.priority,
    })
    setIsUpdateDialogOpen(true)
  }

  const handleSaveUpdate = async () => {
    if (
      editingRequest &&
      editFormData.date &&
      editFormData.room &&
      editFormData.by &&
      editFormData.description &&
      editFormData.priority
    ) {
      try {
        await updateRequest(editingRequest.id, editFormData)
        setIsUpdateDialogOpen(false)
        setEditingRequest(null)
      } catch (err) {
        console.error('Failed to update request:', err)
      }
    }
  }

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false)
    setEditingRequest(null)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Paths */}
      <BackgroundPaths />

      <div className="relative z-10 pt-6 px-8">
        <Link href="/">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/5 border border-white/10 font-light transition-all"
          >
            ← Back to Home
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Maintenance Request Form */}
            <div
              className="backdrop-blur-xl border-white/10 p-8 rounded-2xl space-y-6"
              style={{
                background: "transparent",
                backdropFilter: "blur(2px) saturate(120%) brightness(102%) contrast(101%)",
                boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 15px rgba(59, 130, 246, 0.05)",
                WebkitBackdropFilter: "blur(2px) saturate(120%) brightness(102%) contrast(101%)",
              }}
            >
              <h1 className="text-3xl font-light text-white tracking-tight">Maintenance Request</h1>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-light text-gray-300">Requested date:</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-light text-gray-300">Room Number:</label>
                  <Input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-light text-gray-300">Requested by:</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.by}
                  onChange={(e) => setFormData({ ...formData, by: e.target.value })}
                  className="w-full bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-light text-gray-300">Description of work/repair:</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[100px] bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/10 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-light text-gray-300">Requested Priority:</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="w-full bg-black/30 border-white/10 text-white focus:border-white/20 focus:ring-white/10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-white/20 text-white backdrop-blur-xl">
                    <SelectItem value="low" className="text-white focus:bg-white/10 focus:text-white">
                      Low
                    </SelectItem>
                    <SelectItem value="medium" className="text-white focus:bg-white/10 focus:text-white">
                      Medium
                    </SelectItem>
                    <SelectItem value="high" className="text-white focus:bg-white/10 focus:text-white">
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  onClick={handleAdd}
                  className="w-full bg-black/80 hover:bg-black/60 text-white border border-white/20 font-light transition-all"
                >
                  Add
                </Button>
                <Button
                  onClick={handleClear}
                  className="w-full bg-black/80 hover:bg-black/60 text-white border border-white/20 font-light transition-all"
                >
                  Clear form
                </Button>
              </div>
            </div>

            {/* List of Requests */}
            <div
              className="backdrop-blur-xl border-white/10 p-8 rounded-2xl"
              style={{
                background: "transparent",
                backdropFilter: "blur(2px) saturate(120%) brightness(102%) contrast(101%)",
                boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 15px rgba(59, 130, 246, 0.05)",
                WebkitBackdropFilter: "blur(2px) saturate(120%) brightness(102%) contrast(101%)",
              }}
            >
              <h2 className="text-2xl font-light text-white mb-6 tracking-tight">List of requests</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 font-light">Error: {error}</p>
                  <Button
                    onClick={fetchRequests}
                    className="mt-2 bg-red-500/40 hover:bg-red-500/30 text-white font-light"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-white font-light">Loading requests...</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-4 py-4 text-left font-medium text-gray-300 text-sm">ReqID</th>
                        <th className="px-4 py-4 text-left font-medium text-gray-300 text-sm">Date</th>
                        <th className="px-4 py-4 text-left font-medium text-gray-300 text-sm">Room#</th>
                        <th className="px-4 py-4 text-left font-medium text-gray-300 text-sm">By</th>
                        <th className="px-4 py-4 text-left font-medium text-gray-300 text-sm">Description</th>
                        <th className="px-4 py-4 text-left font-medium text-gray-300 text-sm">Priority</th>
                        <th className="px-4 py-4 text-left font-medium text-gray-300 text-sm">Update?</th>
                        <th className="px-4 py-4 text-left font-medium text-gray-300 text-sm">Delete?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request, index) => (
                        <tr
                          key={request.id}
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index % 2 === 0 ? "bg-black/10" : "bg-transparent"
                            }`}
                        >
                          <td className="px-4 py-3 text-white font-light">{request.id}</td>
                          <td className="px-4 py-3 text-white font-light">{request.date}</td>
                          <td className="px-4 py-3 text-white font-light">{request.room}</td>
                          <td className="px-4 py-3 text-white font-light">{request.requested_by}</td>
                          <td className="px-4 py-3 text-white font-light">{request.description}</td>
                          <td className="px-4 py-3">
                            <span className="text-white font-light">{request.priority}</span>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              onClick={() => handleOpenUpdateDialog(request)}
                              className="bg-blue-500/40 hover:bg-blue-500/30 text-white font-light transition-all"
                            >
                              Update
                            </Button>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              onClick={() => handleDeleteClick(request.id)}
                              className="bg-red-500/40 hover:bg-red-500/30 text-white font-light transition-all"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack Sidebar */}
          <div className="lg:col-span-1">
            <div
              className="backdrop-blur-xl border-white/10 p-6 rounded-2xl space-y-4 sticky top-8"
              style={{
                background: "transparent",
                boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 15px rgba(59, 130, 246, 0.05)",
                WebkitBackdropFilter: "blur(2px) saturate(120%) brightness(102%) contrast(101%)",
              }}
            >
              <h2 className="text-xl font-light text-white tracking-tight">Tech Stack</h2>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-blue-300 mb-2">Frontend</h3>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div>• Next.js (React)</div>
                    <div>• TypeScript</div>
                    <div>• Tailwind CSS</div>
                    <div>• Vercel Deployment</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-green-300 mb-2">Backend</h3>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div>• PHP 8.1</div>
                    <div>• PDO (Database)</div>
                    <div>• RESTful API</div>
                    <div>• Railway Deployment</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-purple-300 mb-2">Database</h3>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div>• MySQL</div>
                    <div>• Railway Hosting</div>
                    <div>• CRUD Operations</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-yellow-300 mb-2">Team Members</h3>
                    <div className="space-y-1 text-xs text-gray-300">
                      <div>• Ramkrishna Sharma</div>
                      <div>• Aaron Dai</div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    <strong className="text-white">CS 4750 Databases - POTD 5:</strong> Database Interfacing assignment. We built this full-stack maintenance request management system based on the official POTD 5 requirements, demonstrating modern web development practices with complete CRUD functionality.
                  </p>

                  {/* Progress Button */}
                  <button
                    onClick={() => setShowProgressImage(true)}
                    className="mt-4 w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-light py-2 px-4 rounded-lg border border-blue-500/30 transition-all duration-200 hover:border-blue-400/50"
                  >
                    See Our Progress!
                  </button>

                  <div className="pt-2">
                    <a
                      href="https://www.cs.virginia.edu/~up3f/cs4750/inclass/potd5-DB-interfacing.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-300 hover:text-blue-200 underline transition-colors"
                    >
                      View Official Assignment →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="bg-black/95 border-white/20 text-white backdrop-blur-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-white">
              Update Maintenance Request #{editingRequest?.id}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-light text-gray-300">Requested date:</label>
                <Input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                  className="w-full bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-light text-gray-300">Room Number:</label>
                <Input
                  type="text"
                  value={editFormData.room}
                  onChange={(e) => setEditFormData({ ...editFormData, room: e.target.value })}
                  className="w-full bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-light text-gray-300">Requested by:</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={editFormData.by}
                onChange={(e) => setEditFormData({ ...editFormData, by: e.target.value })}
                className="w-full bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-light text-gray-300">Description of work/repair:</label>
              <Textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full min-h-[100px] bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/10 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-light text-gray-300">Requested Priority:</label>
              <Select
                value={editFormData.priority}
                onValueChange={(value) => setEditFormData({ ...editFormData, priority: value })}
              >
                <SelectTrigger className="w-full bg-black/30 border-white/10 text-white focus:border-white/20 focus:ring-white/10">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-white/20 text-white backdrop-blur-xl">
                  <SelectItem value="low" className="text-white focus:bg-white/10 focus:text-white">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="text-white focus:bg-white/10 focus:text-white">
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="text-white focus:bg-white/10 focus:text-white">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleCloseUpdateDialog}
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 font-light"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUpdate}
              className="bg-blue-500/80 hover:bg-blue-500/60 text-white border border-blue-500/30 font-light transition-all"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-black/95 border-red-500/30 text-white backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-light text-white">
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 font-light">
              This action cannot be undone. This will permanently delete maintenance request #{deleteRequestId}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelDelete}
              className="bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-white/10 font-light"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500/80 hover:bg-red-500/60 text-white border border-red-500/30 font-light transition-all"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Progress Image Modal */}
      <Dialog open={showProgressImage} onOpenChange={setShowProgressImage}>
        <DialogContent className="bg-black/95 border-white/20 text-white backdrop-blur-xl max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-light text-white">
              Our Development Progress
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Here's a snapshot of our Railway deployment dashboard showing our successful deployments and development progress:
              </p>

                <div className="relative rounded-lg overflow-hidden border border-white/10">
                  <img 
                    src="/images/rail.png" 
                    alt="Railway deployment dashboard showing successful deployments"
                    className="w-full h-auto rounded-lg"
                  />
                </div>

              <div className="text-xs text-gray-400 space-y-2">
                <p><strong className="text-white">What you see:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Active deployment with green checkmark</li>
                  <li>Deployment history showing our iterative development process</li>
                  <li>GitHub integration with commit messages</li>
                  <li>MySQL service running alongside our PHP backend</li>
                  <li>Successful deployment URL: potd5-maintenance-system-production.up.railway.app</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowProgressImage(false)}
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 hover:border-blue-400/50"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

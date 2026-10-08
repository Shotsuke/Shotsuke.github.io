import AppKit
import CoreGraphics
import Foundation

// Application metadata only: no window titles, browser URLs, screenshots, or keystrokes.
let app = NSWorkspace.shared.frontmostApplication
let idle = CGEventSource.secondsSinceLastEventType(.combinedSessionState, eventType: CGEventType(rawValue: UInt32.max)!)
let result: [String: Any] = [
    "app": app?.localizedName ?? "",
    "process": app?.bundleIdentifier ?? "",
    "idle_seconds": idle.isFinite ? min(Int(idle), 86400) : 86400
]
let data = try JSONSerialization.data(withJSONObject: result, options: [.sortedKeys])
print(String(decoding: data, as: UTF8.self))

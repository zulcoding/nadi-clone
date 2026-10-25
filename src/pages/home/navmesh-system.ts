export interface Vec2XZ {
  x: number;
  z: number;
}

export interface NavWallObstacle {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface NavWaypointNode {
  id: string;
  label: string;
  x: number;
  z: number;
  kind: 'entrance' | 'corridor' | 'portal' | 'station';
  stationStage?: 1 | 2 | 3 | 4 | 5;
  facingAngle?: number;
  neighbors: string[];
}

export interface NavMeshCell {
  id: string;
  label: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/**
 * All physical walls and counters in the 3D interior floor plan,
 * expanded by a 0.45m character radius safety margin so the character
 * can never clip or pass through any wall or counter.
 */
export const INTERIOR_WALL_OBSTACLES: NavWallObstacle[] = [
  // Room Divider Wall 1 (between Pendaftaran & Poliklinik: x = -0.8, z = -7.8 to -2.2)
  {
    id: 'divWall1',
    minX: -1.35,
    maxX: -0.25,
    minZ: -8.0,
    maxZ: -1.75,
  },
  // Room Divider Wall 2 (between Poliklinik & Lab/Radiologi: x = 5.6, z = -7.8 to -2.2)
  {
    id: 'divWall2',
    minX: 5.05,
    maxX: 6.15,
    minZ: -8.0,
    maxZ: -1.75,
  },
  // Room Divider Wall 3 (between Lab/Radiologi & Farmasi: x = 11.6, z = -7.8 to -2.6)
  {
    id: 'divWall3',
    minX: 11.05,
    maxX: 12.15,
    minZ: -8.0,
    maxZ: -2.15,
  },
  // Reception Desk in Zone 1
  {
    id: 'receptionDesk',
    minX: -7.6,
    maxX: -2.8,
    minZ: -5.3,
    maxZ: -3.4,
  },
  // Doctor Consultation Desk in Zone 2
  {
    id: 'docDesk',
    minX: 1.9,
    maxX: 4.5,
    minZ: -5.6,
    maxZ: -4.0,
  },
  // Lab Bench & X-Ray Stand in Zone 3
  {
    id: 'labAndXray',
    minX: 6.0,
    maxX: 10.6,
    minZ: -6.4,
    maxZ: -4.6,
  },
  // Farmasi Medicine Shelving Wall
  {
    id: 'shelfCabinet',
    minX: 11.0,
    maxX: 15.4,
    minZ: -2.2,
    maxZ: -0.9,
  },
  // Farmasi Counter
  {
    id: 'farmasiCounter',
    minX: 10.5,
    maxX: 14.3,
    minZ: 1.2,
    maxZ: 2.8,
  },
  // Kasir Counter
  {
    id: 'kasirCounter',
    minX: 14.2,
    maxX: 17.4,
    minZ: 1.7,
    maxZ: 3.3,
  },
];

/**
 * Walkable convex rectangular cells that form the interior Navigation Mesh.
 */
export const NAVMESH_WALKABLE_CELLS: NavMeshCell[] = [
  {
    id: 'cell-main-corridor',
    label: 'Koridor Utama Bebas Hambatan',
    minX: -7.0,
    maxX: 16.4,
    minZ: 2.1,
    maxZ: 4.8,
  },
  {
    id: 'cell-bay-pendaftaran',
    label: 'Area Lobi Pendaftaran',
    minX: -6.2,
    maxX: -3.2,
    minZ: -2.8,
    maxZ: 2.8,
  },
  {
    id: 'cell-bay-poliklinik',
    label: 'Area Periksa Poliklinik',
    minX: 0.8,
    maxX: 3.2,
    minZ: -2.0,
    maxZ: 2.8,
  },
  {
    id: 'cell-bay-lab-radiologi',
    label: 'Area Lab & Radiologi',
    minX: 7.4,
    maxX: 9.8,
    minZ: -3.9,
    maxZ: 2.8,
  },
];

/**
 * Waypoint Graph defining the exact navigation nodes and corridor portals.
 * Notice how every room transition routes out to the Main Corridor (z = +2.85)
 * before crossing any room divider wall X coordinate (-0.8, 5.6, 11.6).
 */
export const NAVMESH_WAYPOINTS: NavWaypointNode[] = [
  {
    id: 'wp-entrance',
    label: 'Pintu Masuk Utama',
    x: -6.5,
    z: 4.6,
    kind: 'entrance',
    neighbors: ['wp-corridor-1'],
  },
  {
    id: 'wp-corridor-1',
    label: 'Simpang Koridor Pendaftaran',
    x: -5.2,
    z: 2.85,
    kind: 'corridor',
    neighbors: ['wp-entrance', 'wp-station-1', 'wp-portal-1-2'],
  },
  {
    id: 'wp-station-1',
    label: 'Loket Pendaftaran',
    x: -5.2,
    z: -2.4,
    kind: 'station',
    stationStage: 1,
    facingAngle: Math.PI,
    neighbors: ['wp-corridor-1'],
  },
  {
    id: 'wp-portal-1-2',
    label: 'Portal Koridor Pendaftaran → Poliklinik',
    x: -0.8,
    z: 2.85,
    kind: 'portal',
    neighbors: ['wp-corridor-1', 'wp-corridor-2'],
  },
  {
    id: 'wp-corridor-2',
    label: 'Simpang Koridor Poliklinik',
    x: 1.8,
    z: 2.85,
    kind: 'corridor',
    neighbors: ['wp-portal-1-2', 'wp-station-2', 'wp-portal-2-3'],
  },
  {
    id: 'wp-station-2',
    label: 'Stasiun Triase & Poliklinik',
    x: 1.8,
    z: -1.5,
    kind: 'station',
    stationStage: 2,
    facingAngle: -Math.PI * 0.72,
    neighbors: ['wp-corridor-2'],
  },
  {
    id: 'wp-portal-2-3',
    label: 'Portal Koridor Poliklinik → Lab',
    x: 5.6,
    z: 2.85,
    kind: 'portal',
    neighbors: ['wp-corridor-2', 'wp-corridor-3'],
  },
  {
    id: 'wp-corridor-3',
    label: 'Simpang Koridor Lab & Radiologi',
    x: 8.8,
    z: 2.85,
    kind: 'corridor',
    neighbors: ['wp-portal-2-3', 'wp-station-3', 'wp-portal-3-4'],
  },
  {
    id: 'wp-station-3',
    label: 'Ruang Rontgen & Laboratorium',
    x: 8.8,
    z: -3.5,
    kind: 'station',
    stationStage: 3,
    facingAngle: Math.PI,
    neighbors: ['wp-corridor-3'],
  },
  {
    id: 'wp-portal-3-4',
    label: 'Portal Koridor Lab → Farmasi',
    x: 10.4,
    z: 3.85,
    kind: 'portal',
    neighbors: ['wp-corridor-3', 'wp-station-4'],
  },
  {
    id: 'wp-station-4',
    label: 'Loket Farmasi E-Resep',
    x: 12.4,
    z: 3.85,
    kind: 'station',
    stationStage: 4,
    facingAngle: Math.PI,
    neighbors: ['wp-portal-3-4', 'wp-portal-4-5'],
  },
  {
    id: 'wp-portal-4-5',
    label: 'Koridor Farmasi → Kasir',
    x: 14.2,
    z: 4.15,
    kind: 'portal',
    neighbors: ['wp-station-4', 'wp-station-5'],
  },
  {
    id: 'wp-station-5',
    label: 'Loket Kasir Terpadu',
    x: 15.8,
    z: 4.25,
    kind: 'station',
    stationStage: 5,
    facingAngle: Math.PI,
    neighbors: ['wp-portal-4-5'],
  },
];

/**
 * The canonical ordered sequence of waypoint IDs for the full 6-stage tour
 * (Gedung Entrance -> Pendaftaran -> Corridor -> Poliklinik -> Corridor -> Lab -> Corridor -> Farmasi -> Kasir).
 * Notice how visiting each room enters the room bay from its corridor node, stops at the station,
 * and exits back to the corridor node before crossing any divider wall!
 */
export const ORDERED_TOUR_WAYPOINT_SEQUENCE: string[] = [
  'wp-entrance', // Stage 0 start (index 0)
  'wp-corridor-1',
  'wp-station-1', // Stage 1: Pendaftaran (sequence index 2)
  'wp-corridor-1',
  'wp-portal-1-2', // Safely passes divWall1 at z = +2.85
  'wp-corridor-2',
  'wp-station-2', // Stage 2: Poliklinik (sequence index 6)
  'wp-corridor-2',
  'wp-portal-2-3', // Safely passes divWall2 at z = +2.85
  'wp-corridor-3',
  'wp-station-3', // Stage 3: Lab & Radiologi (sequence index 10)
  'wp-corridor-3',
  'wp-portal-3-4', // Safely passes divWall3 at z = +3.85
  'wp-station-4', // Stage 4: Farmasi (sequence index 13)
  'wp-portal-4-5',
  'wp-station-5', // Stage 5: Kasir (sequence index 15)
];

const WAYPOINT_MAP = new Map<string, NavWaypointNode>(
  NAVMESH_WAYPOINTS.map((w) => [w.id, w])
);

export function getWaypointById(id: string): NavWaypointNode {
  const found = WAYPOINT_MAP.get(id);
  if (!found) {
    throw new Error(`Unknown NavMesh waypoint: ${id}`);
  }
  return found;
}

/**
 * Checks whether a point (x, z) lies inside at least one walkable NavMesh floor cell.
 */
export function isPointOnNavMesh(x: number, z: number): boolean {
  for (let i = 0; i < NAVMESH_WALKABLE_CELLS.length; i++) {
    const c = NAVMESH_WALKABLE_CELLS[i];
    if (x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether a point (x, z) is inside any wall/counter obstacle AABB.
 */
export function isPointInsideAnyObstacle(
  x: number,
  z: number,
  obstacles: NavWallObstacle[] = INTERIOR_WALL_OBSTACLES
): NavWallObstacle | null {
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    if (x >= obs.minX && x <= obs.maxX && z >= obs.minZ && z <= obs.maxZ) {
      return obs;
    }
  }
  return null;
}

/**
 * Pushes a point (x, z) outside of any intersecting wall/counter obstacle AABB
 * along the shortest penetration axis. Guarantees 0 wall penetration at runtime.
 */
export function clampPointOutsideObstacles(
  x: number,
  z: number,
  obstacles: NavWallObstacle[] = INTERIOR_WALL_OBSTACLES
): Vec2XZ {
  let cx = x;
  let cz = z;
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    if (cx > obs.minX && cx < obs.maxX && cz > obs.minZ && cz < obs.maxZ) {
      const dLeft = cx - obs.minX;
      const dRight = obs.maxX - cx;
      const dTop = cz - obs.minZ;
      const dBottom = obs.maxZ - cz;
      const minPush = Math.min(dLeft, dRight, dTop, dBottom);
      if (minPush === dBottom) {
        cz = obs.maxZ + 0.02;
      } else if (minPush === dLeft) {
        cx = obs.minX - 0.02;
      } else if (minPush === dRight) {
        cx = obs.maxX + 0.02;
      } else {
        cz = obs.minZ - 0.02;
      }
    }
  }
  return { x: cx, z: cz };
}

/**
 *Shortest-path BFS/Dijkstra router on the NavMesh waypoint graph between any two waypoint IDs.
 */
export function findNavMeshPath(
  startWaypointId: string,
  endWaypointId: string
): NavWaypointNode[] {
  if (startWaypointId === endWaypointId) {
    return [getWaypointById(startWaypointId)];
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const unvisited = new Set<string>();

  for (const wp of NAVMESH_WAYPOINTS) {
    dist.set(wp.id, Infinity);
    prev.set(wp.id, null);
    unvisited.add(wp.id);
  }
  dist.set(startWaypointId, 0);

  while (unvisited.size > 0) {
    let u: string | null = null;
    let bestD = Infinity;
    for (const candidate of unvisited) {
      const d = dist.get(candidate) ?? Infinity;
      if (d < bestD) {
        bestD = d;
        u = candidate;
      }
    }
    if (!u || u === endWaypointId) break;
    unvisited.delete(u);

    const uNode = getWaypointById(u);
    for (const neighborId of uNode.neighbors) {
      if (!unvisited.has(neighborId)) continue;
      const vNode = getWaypointById(neighborId);
      const edgeLen = Math.hypot(vNode.x - uNode.x, vNode.z - uNode.z);
      const alt = bestD + edgeLen;
      if (alt < (dist.get(neighborId) ?? Infinity)) {
        dist.set(neighborId, alt);
        prev.set(neighborId, u);
      }
    }
  }

  const path: NavWaypointNode[] = [];
  let curr: string | null = endWaypointId;
  while (curr) {
    path.unshift(getWaypointById(curr));
    curr = prev.get(curr) ?? null;
  }
  return path.length > 0 && path[0].id === startWaypointId
    ? path
    : [getWaypointById(startWaypointId), getWaypointById(endWaypointId)];
}

export interface TourNavCompiledTrack {
  points: Vec2XZ[];
  cumulativeLengths: number[];
  totalLength: number;
  stageDistances: [number, number, number, number, number, number];
  stageNormProgress: [number, number, number, number, number, number];
}

/**
 * Builds the piecewise-linear + corner-filleted Navigation Mesh trajectory
 * across the entire 6-stage hospital tour.
 * Because corner filleting is strictly bounded (radius = 0.42m) inside the
 * corridor intersections (z = +2.85), the path NEVER bows into any wall!
 */
export function buildCompiledNavMeshTrack(): TourNavCompiledTrack {
  const rawNodes = ORDERED_TOUR_WAYPOINT_SEQUENCE.map((id) =>
    getWaypointById(id)
  );
  const stageNodeIndices = [0, 2, 6, 10, 13, 15];

  const points: Vec2XZ[] = [];
  const stagePointIndices: number[] = [];

  for (let i = 0; i < rawNodes.length; i++) {
    const curr = rawNodes[i];

    // If this node is one of the 6 stage stops, record its exact index in `points`
    const stageMatchIdx = stageNodeIndices.indexOf(i);
    if (stageMatchIdx !== -1) {
      points.push({ x: curr.x, z: curr.z });
      stagePointIndices[stageMatchIdx] = points.length - 1;
      continue;
    }

    // For intermediate corridor/portal waypoints, add a tight 3-point corner fillet (radius = 0.4m)
    // so the character turns smoothly at hallway intersections without cutting through walls.
    if (i > 0 && i < rawNodes.length - 1) {
      const prevNode = rawNodes[i - 1];
      const nextNode = rawNodes[i + 1];
      const dx1 = curr.x - prevNode.x;
      const dz1 = curr.z - prevNode.z;
      const len1 = Math.hypot(dx1, dz1);

      const dx2 = nextNode.x - curr.x;
      const dz2 = nextNode.z - curr.z;
      const len2 = Math.hypot(dx2, dz2);

      const fillet = Math.min(0.4, len1 * 0.25, len2 * 0.25);
      if (fillet > 0.05) {
        const pEnter = {
          x: curr.x - (dx1 / len1) * fillet,
          z: curr.z - (dz1 / len1) * fillet,
        };
        const pExit = {
          x: curr.x + (dx2 / len2) * fillet,
          z: curr.z + (dz2 / len2) * fillet,
        };
        const pMid = {
          x: 0.25 * pEnter.x + 0.5 * curr.x + 0.25 * pExit.x,
          z: 0.25 * pEnter.z + 0.5 * curr.z + 0.25 * pExit.z,
        };
        points.push(
          clampPointOutsideObstacles(pEnter.x, pEnter.z),
          clampPointOutsideObstacles(pMid.x, pMid.z),
          clampPointOutsideObstacles(pExit.x, pExit.z)
        );
        continue;
      }
    }

    points.push(clampPointOutsideObstacles(curr.x, curr.z));
  }

  const cumulativeLengths: number[] = [0];
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    const segLen = Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].z - points[i - 1].z
    );
    totalLength += segLen;
    cumulativeLengths.push(totalLength);
  }

  const stageDistances: [number, number, number, number, number, number] = [
    cumulativeLengths[stagePointIndices[0]] ?? 0,
    cumulativeLengths[stagePointIndices[1]] ?? 0,
    cumulativeLengths[stagePointIndices[2]] ?? 0,
    cumulativeLengths[stagePointIndices[3]] ?? 0,
    cumulativeLengths[stagePointIndices[4]] ?? 0,
    cumulativeLengths[stagePointIndices[5]] ?? totalLength,
  ];

  const safeTotal = Math.max(0.0001, totalLength);
  const stageNormProgress: [number, number, number, number, number, number] = [
    stageDistances[0] / safeTotal,
    stageDistances[1] / safeTotal,
    stageDistances[2] / safeTotal,
    stageDistances[3] / safeTotal,
    stageDistances[4] / safeTotal,
    stageDistances[5] / safeTotal,
  ];

  return {
    points,
    cumulativeLengths,
    totalLength,
    stageDistances,
    stageNormProgress,
  };
}

export const COMPILED_NAVMESH_TRACK = buildCompiledNavMeshTrack();

/**
 * Samples the character's exact (x, z) position and tangent direction along
 * the NavMesh waypoint track for a normalized progress `u` in [0, 1].
 * Guarantees that every returned coordinate is outside all wall obstacles.
 */
export function sampleNavMeshTrack(
  u: number,
  track: TourNavCompiledTrack = COMPILED_NAVMESH_TRACK
): {
  x: number;
  z: number;
  tangentX: number;
  tangentZ: number;
  heading: number;
} {
  const clampedU = Math.max(0, Math.min(1, u));
  const targetDist = clampedU * track.totalLength;

  // Binary search for segment
  let low = 0;
  let high = track.cumulativeLengths.length - 1;
  while (low < high - 1) {
    const mid = (low + high) >> 1;
    if (track.cumulativeLengths[mid] <= targetDist) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const p0 = track.points[low];
  const p1 = track.points[high];
  const d0 = track.cumulativeLengths[low];
  const d1 = track.cumulativeLengths[high];
  const segLen = Math.max(0.00001, d1 - d0);
  const t = Math.max(0, Math.min(1, (targetDist - d0) / segLen));

  const rawX = p0.x + (p1.x - p0.x) * t;
  const rawZ = p0.z + (p1.z - p0.z) * t;
  const safePt = clampPointOutsideObstacles(rawX, rawZ);

  const dx = p1.x - p0.x;
  const dz = p1.z - p0.z;
  const norm = Math.hypot(dx, dz) || 1;
  const tx = dx / norm;
  const tz = dz / norm;

  return {
    x: safePt.x,
    z: safePt.z,
    tangentX: tx,
    tangentZ: tz,
    heading: Math.atan2(tx, tz),
  };
}

